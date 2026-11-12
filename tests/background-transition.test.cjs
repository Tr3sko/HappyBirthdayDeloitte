const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

process.env.TZ = "UTC";

const source = fs.readFileSync(path.join(__dirname, "../src/HappyBirthdayDelita.ts"), "utf8");
const script = new vm.Script(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText);

function deferred() {
    let resolve;
    let reject;
    const promise = new Promise((resolvePromise, rejectPromise) => {
        resolve = resolvePromise;
        reject = rejectPromise;
    });
    return { promise, resolve, reject };
}

function createApp(initialDate, imageDecode) {
    let now = initialDate.getTime();
    let onLoad;
    let tick;
    const classes = new Set();
    const elements = Object.fromEntries(
        ["element", "days", "hours", "minutes", "seconds", "birthday-message"]
            .map(id => [id, {
                style: {},
                textContent: "",
                classList: {
                    add: name => classes.add(name),
                    remove: name => classes.delete(name),
                    contains: name => classes.has(name)
                }
            }])
    );

    class Clock extends Date {
        constructor(...args) {
            if (args.length === 0) super(now);
            else super(...args);
        }

        static now() {
            return now;
        }
    }

    class MockImage {
        decode() {
            return imageDecode.promise;
        }
    }

    script.runInNewContext({
        exports: {},
        require(id) {
            assert.equal(id, "./particles");
            return { start: async () => {} };
        },
        Date: Clock,
        Image: MockImage,
        document: {
            getElementById: id => elements[id],
            addEventListener: (event, callback) => { if (event === "DOMContentLoaded") onLoad = callback; }
        },
        setInterval: callback => { tick = callback; }
    });
    onLoad();

    return {
        elements,
        hasBirthdayBackground: () => classes.has("birthday-background"),
        advance(date) {
            now = date.getTime();
            tick();
        }
    };
}

async function flushPromises() {
    await Promise.resolve();
    await Promise.resolve();
}

test("fades to the birthday photo only after its image is decoded", async () => {
    const imageDecode = deferred();
    const start = new Date(2026, 10, 12, 12);
    const app = createApp(start, imageDecode);

    app.advance(new Date(start.getTime() + 5000));
    assert.equal(app.hasBirthdayBackground(), false);
    assert.equal(app.elements.element.style.backgroundImage, "url('/Delita.jpg')");

    imageDecode.resolve();
    await flushPromises();
    assert.equal(app.hasBirthdayBackground(), true);
});

test("keeps the normal photo visible when the birthday image fails to decode", async () => {
    const imageDecode = deferred();
    const start = new Date(2026, 10, 12, 12);
    const app = createApp(start, imageDecode);

    app.advance(new Date(start.getTime() + 5000));
    imageDecode.reject(new Error("Image decode failed"));
    await flushPromises();

    assert.equal(app.hasBirthdayBackground(), false);
    assert.equal(app.elements.element.style.backgroundImage, "url('/Delita.jpg')");
});

test("does not show the birthday photo if birthday mode ends before decoding finishes", async () => {
    const imageDecode = deferred();
    const start = new Date(2026, 10, 12, 23, 59, 45);
    const app = createApp(start, imageDecode);

    app.advance(new Date(start.getTime() + 5000));
    assert.equal(app.elements["birthday-message"].style.display, "block");

    app.advance(new Date(new Date(2026, 10, 13).getTime() - 5000));
    assert.equal(app.elements["birthday-message"].style.display, "none");
    imageDecode.resolve();
    await flushPromises();

    assert.equal(app.hasBirthdayBackground(), false);
});
