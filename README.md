# MindSync (Discord Bot)
Task-management Discord bot with real-time updating.

## Showcase
To use the bot directly, you can invite it to your server by clicking on the link provided under the 'About' section top-right.

## Prerequisites
If you want to run the bot locally, ensure you have the following:
- Node.js (version 12.0.0 or higher recommended)

- A Discord Bot Token (from the Discord Developer Portal)

## Local Setup

1. Clone the repository to your local machine.
```bash
git clone https://github.com/mohammadalshikh/mindsync
```
2. Install the dependencies.
```bash
npm init
```
```bash
npm install discord.js
```
```bash
npm install moment moment-timezone
```

3. Create a `.env` file in the root directory and populate it with your Bot Token.

```env
TOKEN=replace_with_your_token
```

4. Start the bot.
```bash
node index.js
```

## Inviting The Bot

1. Navigate to the Discord Developer Portal and create a new application.

2. Go to the 'Bot' tab and click on 'Reset Token'. Make sure to copy the token, as you'll need it for running the bot locally.

3. Under the 'OAuth2' tab, select the 'bot' scope and the permissions your bot requires.

4. Use the generated OAuth2 URL to invite the bot to your server.
