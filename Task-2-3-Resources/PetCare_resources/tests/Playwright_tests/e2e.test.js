const { test, describe, beforeEach, afterEach, beforeAll, afterAll, expect } = require('@playwright/test');
const { chromium } = require('playwright');

const host = 'http://localhost:3000'; // Application host (NOT service host - that can be anything)

let browser;
let context;
let page;

let user = {
    email: "",
    password: "123456",
    confirmPass: "123456",
};

let pet = {
    age: "2 years",
    name: "",
    breed: "Random breed",
    image: "/images/cat-create.jpg",
    weight: "2 kg"
};

describe("e2e tests", () => {
    beforeAll(async () => {
        browser = await chromium.launch();
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
    });

    afterEach(async () => {
        await page.close();
        await context.close();
    });


    describe("authentication", () => {
        test("registration makes correct API call", async () => {
            await page.goto(host);
            await page.click("//a[text()='Register']");
            await page.waitForSelector("form");

            let random = Math.floor(Math.random() * 10000);
            user.email = `email_${random}abv.bg`;

            await page.fill("#email", user.email);
            await page.fill("#password", user.password);
            await page.fill("#repeatPassword", user.password);

            let [response] = await Promise.all([page.waitForResponse(response => response.url().includes('/users/register') && response.status() === 200), page.click("//button[@type='submit']")]);

            await expect(response.ok()).toBeTruthy();

            let json = await response.json();

            expect(json.email).toBe(user.email);
            expect(json.password).toBe(user.password);

        });

        test("login makes correct API call", async () => {
            await page.goto(host);
            await page.click("//a[text()='Login']");
            await page.waitForSelector("form");
            await page.fill("#email", user.email);
            await page.fill("#password", user.password);

            let [response] = await Promise.all([page.waitForResponse(response => response.url().includes('/users/login') && response.status() === 200), page.click("//button[@type='submit']")]);

            await expect(response.ok()).toBeTruthy();

            let json = await response.json();

            expect(json.email).toBe(user.email);
            expect(json.password).toBe(user.password);
        });

        test("logout makes correct API call", async () => {
            await page.goto(host);
            await page.click("//a[text()='Login']");
            await page.waitForSelector("form");
            await page.fill("#email", user.email);
            await page.fill("#password", user.password);
            await page.click("//button[@type='submit']");

            let [response] = await Promise.all([page.waitForResponse(response => response.url().includes('/users/logout') && response.status() === 204), page.click("//a[text()='Logout']")]);

            await expect(response.ok()).toBeTruthy();

            await page.waitForSelector("//a[text()='Login']");

            await expect(page.url()).toBe(host + "/");
        })
    });

    describe("navbar", () => {
        test("logged user should see correct navigation", async () => {
            await page.goto(host);
            await page.click("//a[text()='Login']");
            await page.waitForSelector("form");
            await page.fill("#email", user.email);
            await page.fill("#password", user.password);
            await page.click("//button[@type='submit']");

            await expect(page.locator("//a[text()='Home']")).toBeVisible;
            await expect(page.locator("//a[text()='Dashboard']")).toBeVisible;
            await expect(page.locator("//a[text()='Create Postcard']")).toBeVisible;
            await expect(page.locator("//a[text()='Logout']")).toBeVisible;
            await expect(page.locator("//a[text()='Login']")).toBeHidden;
            await expect(page.locator("//a[text()='Register']")).toBeHidden;
        });

        test("guest user should see correct navigation", async () => {
            await page.goto(host);
            await page.click("//a[text()='Login']");
            await page.waitForSelector("form");
            await page.fill("#email", user.email);
            await page.fill("#password", user.password);
            await page.click("//button[@type='submit']");

            await expect(page.locator("//a[text()='Home']")).toBeVisible;
            await expect(page.locator("//a[text()='Dashboard']")).toBeVisible;
            await expect(page.locator("//a[text()='Create Postcard']")).toBeHidden;
            await expect(page.locator("//a[text()='Logout']")).toBeHidden;
            await expect(page.locator("//a[text()='Login']")).toBeHidden;
            await expect(page.locator("//a[text()='Register']")).toBeHidden;
        });
    });

    describe("CRUD", () => {
        beforeEach(async () => {
            await page.goto(host);
            await page.click("//a[text()='Login']");
            await page.waitForSelector("form");
            await page.fill("#email", user.email);
            await page.fill("#password", user.password);
            await page.click("//button[@type='submit']");
        });

        test("create postcard should make correct API call", async () => {
            await page.click("//a[text()='Create Postcard']");
            await page.waitForSelector('form');

            let random = Math.floor(Math.random() * 10000);
            let petRandomName = `random pet name_${random}`;

            await page.fill("#name", `${petRandomName}`);
            await page.fill("#breed", "random breed");
            await page.fill("#age", "random age");
            await page.fill("#weight", "random weight");
            await page.fill("#image", "random image");

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/data/pets") && response.status() === 200),
                page.click('[type="submit"]')
            ]);

            await expect(response.ok()).toBeTruthy();
            let json = await response.json();

            await expect(json.name).toEqual(petRandomName);
            await expect(json.breed).toEqual("random breed");
            await expect(json.age).toEqual("random age");
            await expect(json.weight).toEqual("random weight");
            await expect(json.image).toEqual("random image");
        });

        test("edit postcard should make correct API call", async () => {
            await page.click("//a[text()='Create Postcard']");
            await page.waitForSelector('form');

            let random = Math.floor(Math.random() * 10000);
            let petRandomName = `random pet name_${random}`;

            await page.fill("#name", `${petRandomName}`);
            await page.fill("#breed", "random breed");
            await page.fill("#age", "random age");
            await page.fill("#weight", "random weight");
            await page.fill("#image", "random image");
            await page.click('[type="submit"]')

            await page.click("//a[text()='Dashboard']");
            await page.locator("text=Details").first().click();
            await page.click("//a[@class='edit']");

            await page.waitForSelector('form');

            await page.fill("#breed", "edited breed");

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/data/pets") && response.status() === 200),
                page.click("//button[@type='submit']")
            ]);

            expect(response.ok).toBeTruthy();
            let json = await response.json()

            await expect(json.name).toEqual(petRandomName);
            await expect(json.breed).toEqual("edited breed");
            await expect(json.age).toEqual("random age");
            await expect(json.weight).toEqual("random weight");
            await expect(json.image).toEqual("random image");
        });

        test("delete postcard should make correct API call", async () => {
            await page.click("//a[text()='Dashboard']");
            await page.locator("text=Details").first().click();

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/data/pets") && response.status() === 200), page.on('dialog', dialog => dialog.accept()), page.click("//a[text()='Delete']")
            ]);

            expect(response.ok()).toBeTruthy();
        });
    });
});