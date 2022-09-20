import { InteractionResponseType } from 'discord-interactions';

const handler = {
    handleAddTeamAlert,
    handleRemoveTeamAlert,
    handleAddCompetitionAlert,
    handleRemoveCompetitionAlert,
    handleUnknownCommand
};
export default handler;

function handleAddTeamAlert(req, res) {
    console.log('Handling add team alert.');
    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: 'Handling add team alert.'
        }
    });
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