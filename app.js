import 'dotenv/config';
import express, { response } from 'express';
import {
	InteractionType,
	InteractionResponseType
} from 'discord-interactions';
import { VerifyDiscordRequest, parseCommandArgs } from './utils.js';
import {
	HasGuildCommands,
	FOOTBALL_COMMAND,
} from './commands.js';
import handler from './handlers.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
	// Interaction type and data
	const { type, id, data } = req.body;

	/**
	 * Handle verification requests
	 */
	if (type === InteractionType.PING) {
		console.log('Ping');
		return res.send({ type: InteractionResponseType.PONG });
	}

	/**
	 * Handle slash command requests
	 * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
	 */
	if (type === InteractionType.APPLICATION_COMMAND) {
		const { name } = data;
		const [ commandGroup, subCommand ] = parseCommandArgs(data);

		if (name === 'football' && id) {
			switch (commandGroup.name) {
				case 'team_alert':
					if(subCommand.name === 'add')
						return handler.handleAddTeamAlert(req, res);
					else if(subCommand.name === 'remove')
						return handler.handleRemoveTeamAlert(req, res);
					else
						return handler.handleUnknownCommand(res, subCommand.name);

				case 'competition_alert':
					if(subCommand.name === 'add')
						return handler.handleAddCompetitionAlert(req, res);
					else if(subCommand.name === 'remove')
						return handler.handleRemoveCompetitionAlert(req, res);
					else
						return handler.handleUnknownCommand(res, subCommand.name);
			
				default:
					return handler.handleUnknownCommand(res, commandGroup.name);
			}
		}
	}

	/**
	 * Handle requests from interactive components
	 * See https://discord.com/developers/docs/interactions/message-components#responding-to-a-component-interaction
	 */
	

});

app.listen(PORT, () => {
	console.log('Listening on port', PORT);

	// Check if guild commands from commands.json are installed (if not, install them)
	HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
		FOOTBALL_COMMAND
	]);
});


