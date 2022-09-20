import { capitalize, DiscordRequest } from './utils.js';

export async function HasGuildCommands(appId, guildId, commands) {
	if (guildId === '' || appId === '') return;

	commands.forEach((c) => HasGuildCommand(appId, guildId, c));
}

// Checks for a command
async function HasGuildCommand(appId, guildId, command) {
	// API endpoint to get and post guild commands
	const endpoint = `applications/${appId}/guilds/${guildId}/commands`;

	try {
		const res = await DiscordRequest(endpoint, { method: 'GET' });
		const data = await res.json();

		if (data) {
			const installedNames = data.map((c) => c['name']);
			// This is just matching on the name, so it's not good for updates
			if (installedNames.includes(command['name'])) {
				console.log(`Installing "${command['name']}"`);
				InstallGuildCommand(appId, guildId, command);
			} else {
				console.log(`"${command['name']}" command already installed`);
			}
		}
	} catch (err) {
		console.error(err);
	}
}

// Installs a command
export async function InstallGuildCommand(appId, guildId, command) {
	// API endpoint to get and post guild commands
	const endpoint = `applications/${appId}/guilds/${guildId}/commands`;
	// install command
	try {
		await DiscordRequest(endpoint, { method: 'POST', body: command });
	} catch (err) {
		console.error(err);
	}
}

// Command for football events
export const FOOTBALL_COMMAND = {
	name: 'football',
	description: 'Alert for football events',
	// type: 1,
	options: [
		{
			type: 2,	// SUBCOMMAND GROUP
			name: 'team_alert',
			description: 'Alerts for fixtures of a team',
			options: [
				{
					name: 'add',
					description: "Add",
					type: 1,	// SUBCOMMAND
					options: [
						{
							name: 'team_name',
							description: 'Team name',
							type: 3,	// STRING
							required: true,
							// options: [
							// 	{
							// 		name: 'tag',
							// 		description: 'Allow mentioning user',
							// 		type: 5,	// BOOLEAN
							// 		required: false
							// 	}
							// ]
						}
					]
				},
				{
					name: 'remove',
					description: "Remove alert",
					type: 1,	// SUBCOMMAND
					options: [
						{
							name: 'team_name',
							description: 'Team name',
							type: 3,	// STRING
							required: true,
						}
					]
				}
			]
		},
		{
			type: 2,	// SUBCOMMAND GROUP
			name: 'competition_alert',
			description: 'Alerts for fixtures of a competition',
			options: [
				{
					name: 'add',
					description: "Add",
					type: 1,	// SUBCOMMAND
					options: [
						{
							name: 'competition_name',
							description: 'Competition name',
							type: 3,	// STRING
							required: true,
							// options: [
							// 	{
							// 		name: 'tag',
							// 		description: 'Allow mentioning user',
							// 		type: 5,	// BOOLEAN
							// 		required: false
							// 	}
							// ]
						}
					]
				},
				{
					name: 'remove',
					description: "Remove alert",
					type: 1,	// SUBCOMMAND
					options: [
						{
							name: 'competition_name',
							description: 'Competition name',
							type: 3,	// STRING
							required: true,
						}
					]
				}
			]
		},
		{
			type: 1,	// SUBCOMMAND GROUP
			name: 'match_events',
			description: 'Alerts for events of a match',
		}
	]
};
