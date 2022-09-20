import {
    InteractionResponseType,
    InteractionResponseFlags,
    MessageComponentTypes
} from 'discord-interactions';
import footballAPI from './footballAPI.js';
import { parseCommandArgs } from './utils.js';
import db from './db.js'

async function handleAddTeamCommand(req, res) {
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

        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `Search results for: **${teamSearch}** ⚽`,
                // Indicates it'll be an ephemeral message
                flags: InteractionResponseFlags.EPHEMERAL,
                components: [
                    {
                        type: MessageComponentTypes.ACTION_ROW,
                        components: [
                            {
                                type: MessageComponentTypes.STRING_SELECT,
                                // Append game ID
                                custom_id: `${userId}_team_add`,
                                // Max of 25 choices
                                options: teams.slice(0, 25).map((item) => {
                                    return {
                                        label: item.team.name,
                                        value: item.team.id
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

function handleRemoveTeamCommand(req, res) {
    const userId = req.body.member.user.id;
    const teamIds = db.users_lists.get(userId).teams;

    if (teamIds.length === 0) {
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `No team alerts found\n`
            }
        });
    }
    
    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `Your list of teams alerts ⚽\n`,
            // Indicates it'll be an ephemeral message
            flags: InteractionResponseFlags.EPHEMERAL,
            components: [
                {
                    type: MessageComponentTypes.ACTION_ROW,
                    components: [
                        {
                            type: MessageComponentTypes.STRING_SELECT,
                            // Append game ID
                            custom_id: `${userId}_team_remove`,
                            // Max of 25 choices
                            options: teamIds.slice(0, 25).map((item) => {
                                return {
                                    label: item,
                                    value: item
                                };
                            })
                        },
                    ],
                },
            ],
        },
    });
}

async function handleAddCompetitionCommand(req, res) {
    try {
        const { data } = req.body;
        const userId = req.body.member.user.id;
        const commandArgs = parseCommandArgs(data);
        const leagueSearch = commandArgs[2].value;

        const { response: leagues } = await footballAPI.searchLeague(leagueSearch).then(res => res.json());
        if (leagues.length === 0) {
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: `No matches found for **${leagueSearch}**\n`
                }
            });
        }

        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `Search results for: **${leagueSearch}** 🏆`,
                // Indicates it'll be an ephemeral message
                flags: InteractionResponseFlags.EPHEMERAL,
                components: [
                    {
                        type: MessageComponentTypes.ACTION_ROW,
                        components: [
                            {
                                type: MessageComponentTypes.STRING_SELECT,
                                // Append game ID
                                custom_id: `${userId}_competition_add`,
                                // Max of 25 choices
                                options: leagues.slice(0, 25).map((item) => {
                                    return {
                                        label: item.league.name,
                                        value: item.league.id
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

function handleRemoveCompetitionCommand(req, res) {
    const userId = req.body.member.user.id;
    const competitionIds = db.users_lists.get(userId).competitions;

    if (competitionIds.length === 0) {
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `No competition alerts found\n`
            }
        });
    }
    
    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `Your list of competition alerts 🏆\n`,
            // Indicates it'll be an ephemeral message
            flags: InteractionResponseFlags.EPHEMERAL,
            components: [
                {
                    type: MessageComponentTypes.ACTION_ROW,
                    components: [
                        {
                            type: MessageComponentTypes.STRING_SELECT,
                            // Append game ID
                            custom_id: `${userId}_team_remove`,
                            // Max of 25 choices
                            options: competitionIds.slice(0, 25).map((item) => {
                                return {
                                    label: item,
                                    value: item
                                };
                            })
                        },
                    ],
                },
            ],
        },
    });
}

function handleAddTeamSelection(req, res) {
    const { data } = req.body;
    const [userId] = data.custom_id.split('_');
    const teamId = data.values[0];

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `🔔 Alerts for the team enabled 🔔`
        }
    });
}

function handleRemoveTeamSelection(req, res) {

}

function handleAddCompetitionSelection(req, res) {
    const { data } = req.body;
    const [userId] = data.custom_id.split('_');
    const teamId = data.values[0];

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `🔔 Alerts for the competition enabled 🔔`
        }
    });
}

function handleRemoveCompetitionSelection(req, res) {

}

function handleUnknownCommand(res, commandName) {
    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `Unknown command **${commandName}**\n`
        }
    });
}

const handler = {
    handleAddTeamCommand,
    handleRemoveTeamCommand,
    handleAddCompetitionCommand,
    handleRemoveCompetitionCommand,
    handleUnknownCommand,
    handleAddTeamSelection,
    handleRemoveTeamSelection,
    handleAddCompetitionSelection,
    handleRemoveCompetitionSelection
};
export default handler;
