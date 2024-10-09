const express = require("express");
const asyncHandler = require("express-async-handler");
const { Builder, Browser, By } = require("selenium-webdriver");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", asyncHandler(async (req, res) => {
    try {
        const driver = await new Builder().forBrowser(Browser.CHROME).build();
        const domain = await driver.get("https://www.selenium.dev/selenium/web/web-form.html");

        // Set timer
        await driver.manage().setTimeouts({ implicit: 500 });

        const title = await driver.getTitle();
        const textBox = await driver.findElement(By.name("my-text"))
        const submitButton = await driver.findElement(By.css("button"))
        
        // Actions
        await textBox.sendKeys("Selenium");
        await submitButton.click();

        // Set timer
        await driver.manage().setTimeouts({ implicit: 500 });

        // Get element information
        let messageElement = await driver.findElement(By.css(".display-6"));
        const message = await messageElement.getText();

        if (message === "Form submitted") {
            res.status(200).json({
                status: "success",
                message
            });
        } else {
            throw new Error("Error submitting form");
        }
    } catch (err) {
        res.status(400).send(err);
    }
}))

app.listen(PORT, () => {
    console.log(`App running in port ${PORT}.\n https://localhost:${PORT}`);
});
