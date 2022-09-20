import {
	InteractionResponseType,
	InteractionResponseFlags,
	MessageComponentTypes,
	ButtonStyleTypes,
} from 'discord-interactions';
import footballAPI from './footballAPI.js';
import { parseCommandArgs } from './utils.js';

const handler = {
    handleAddTeamAlert,
    handleRemoveTeamAlert,
    handleAddCompetitionAlert,
    handleRemoveCompetitionAlert,
    handleUnknownCommand
};
export default handler;

async function handleAddTeamAlert(req, res) {
    try {
        const { data } = req.body;
        const userId = req.body.member.user.id;
        const commandArgs = parseCommandArgs(data);
        const teamSearch = commandArgs[2].value;

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
                flags: InteractionResponseFlags.EPHEMERAL,
                components: [
                    {
                        type: MessageComponentTypes.ACTION_ROW,
                        components: [
                            {
                                type: MessageComponentTypes.STRING_SELECT,
                                // Append game ID
                                custom_id: `team_add_${userId}`,
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

function handleRemoveTeamAlert(req, res) {
    console.log('Handling remove team alert.');
    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: 'Handling remove team alert.'
        }
    });
}

function handleAddCompetitionAlert(req, res) {
    console.log('Handling add competition alert.');
    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: 'Handling add competition alert.'
        }
    });
}

function handleRemoveCompetitionAlert(req, res) {
    console.log('Handling remove competition alert.');
    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: 'Handling remove competition alert.'
        }
    });
}

function handleUnknownCommand(res, commandName) {
    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `Unknown command **${commandName}**\n`
        }
    });
}