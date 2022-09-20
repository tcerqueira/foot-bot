let DB = {
    team_alerts_list: [
        {
            teamId: 211,
            mention: false,
            member_id: '364534718072356875',
            guild_id: '761396878570553384',
            channel_id: '761396878570553387'
        }
    ],
    competition_alerts_list: [
        {
            competitionId: 2,
            mention: false,
            member_id: '364534718072356875',
            guild_id: '761396878570553384',
            channel_id: '761396878570553387'
        }
    ],
    users_lists: new Map([
        ['364534718072356875', {
            teams: [ 211 ],
            competitions: [ 2 ]
        }],
    ])
};
export default DB;