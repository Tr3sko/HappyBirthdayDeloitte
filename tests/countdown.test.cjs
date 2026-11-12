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

function createApp(initialDate) {
    let now = initialDate.getTime();
    let onLoad;
    let tick;
    let confettiCount = 0;
    const elements = Object.fromEntries(
        ["element", "days", "hours", "minutes", "seconds", "birthday-message"]
            .map(id => [id, { style: {}, textContent: "" }])
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

    script.runInNewContext({
        exports: {},
        require(id) {
            assert.equal(id, "./particles");
            return { start: async () => { confettiCount++; } };
        },
        Date: Clock,
        document: {
            getElementById: id => elements[id],
            addEventListener: (event, callback) => { if (event === "DOMContentLoaded") onLoad = callback; }
        },
        setInterval: callback => { tick = callback; }
    });
    onLoad();

    return {
        elements,
        get confettiCount() { return confettiCount; },
        advance(date) {
            now = date.getTime();
            tick();
        }
    };
}

test("counts down to May 15 and celebrates only once", async () => {
    const app = createApp(new Date(2026, 4, 14, 23, 59, 59));
    assert.equal(app.elements.seconds.textContent, "01");
    assert.equal(app.elements.element.style.backgroundImage, "url('/Delita.jpg')");

    app.advance(new Date(2026, 4, 15));
    await Promise.resolve();
    assert.equal(app.elements.seconds.textContent, "00");
    assert.equal(app.elements.element.style.backgroundImage, "url('/BirthdayDelita.jpg')");
    assert.equal(app.elements["birthday-message"].style.display, "block");
    assert.equal(app.confettiCount, 1);

    app.advance(new Date(2026, 4, 16, 23, 59, 59));
    assert.equal(app.elements.days.textContent, "00");
    assert.equal(app.confettiCount, 1);
});

test("keeps birthday mode through May 16 and resets for the next year", async () => {
    const app = createApp(new Date(2026, 4, 16, 12));
    await Promise.resolve();
    assert.equal(app.elements.days.textContent, "00");
    assert.equal(app.elements["birthday-message"].style.display, "block");
    assert.equal(app.confettiCount, 1);

    app.advance(new Date(2026, 4, 17));
    assert.equal(app.elements.days.textContent, "363");
    assert.equal(app.elements.element.style.backgroundImage, "url('/Delita.jpg')");
    assert.equal(app.elements["birthday-message"].style.display, "none");

    app.advance(new Date(2027, 4, 15));
    await Promise.resolve();
    assert.equal(app.elements.days.textContent, "00");
    assert.equal(app.elements["birthday-message"].style.display, "block");
    assert.equal(app.confettiCount, 2);
});

test("a page opened after May 16 counts down to the next birthday, including leap years", () => {
    const app = createApp(new Date(2027, 4, 17));
    assert.equal(app.elements.days.textContent, "364");
    assert.equal(app.elements.hours.textContent, "00");
    assert.equal(app.confettiCount, 0);
});