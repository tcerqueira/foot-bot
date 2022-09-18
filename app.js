import 'dotenv/config';
import express, { response } from 'express';
import {
	InteractionType,
	InteractionResponseType,
	InteractionResponseFlags,
	MessageComponentTypes,
	ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest, getRandomEmoji, DiscordRequest } from './utils.js';
import {
	HasGuildCommands,
	FOOTBALL_COMMAND,
} from './commands.js';
import { footballAPI } from './footballAPI.js';
import { DB } from './fakeDB.js';

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
		const { name, options } = data;
		const [{ value: eventType }, { value: teamSearch }] = options;
		const userId = req.body.member.user.id;

		if (name === 'football' && id) {
			try {
				const { response: teams } = await footballAPI.searchTeam(teamSearch).then(res => res.json());
				if (teams.length === 0) {
					return res.send({
						type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
						data: {
							content: `No matches found for **${teamSearch}**\n`
						}
					});
				}

				res.send({
					type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
					data: {
						content: `Search results for: ${teamSearch}`,
						// Indicates it'll be an ephemeral message
						// flags: InteractionResponseFlags.EPHEMERAL,
						components: [
							{
								type: MessageComponentTypes.ACTION_ROW,
								components: [
									{
										type: MessageComponentTypes.STRING_SELECT,
										// Append game ID
										custom_id: `select_choice_${userId}`,
										// Max of 25 choices
										options: teams.slice(0, 25).map((item) => {
											return {
												label: item.team.name,
												value: item.team.name.toLowerCase()
											};
										})
									},
								],
							},
						],
					},
				});
			} catch (err) {
				console.log(err);
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


