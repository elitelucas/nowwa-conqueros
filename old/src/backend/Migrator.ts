import { ReplicantMigrator } from '@play-co/replicant';
// IMPORTANT: Do *NOT* import anything.

const migrator = new ReplicantMigrator();
migrator.addMigration(1, (state) => {
    delete state.tournament;
    delete state.globalTournament;
});
migrator.addMigration(2, (state) => {
    if (state.farms) {
        delete state.farms;
    }
});
migrator.addMigration(3, (state) => {
    if (state.challenges) {
        if (state.challenges.turnData) {
            delete state.challenges.turnData;
        }
        if (state.challenges.turn) {
            delete state.challenges.turn;
        }
        if (state.challenges.players) {
            delete state.challenges.players;
        }
    }
});
migrator.addMigration(4, (state) => {
    if (state.maxScores) {
        if (state.maxScores.lastUpdated || state.maxScores.lastUpdated == 0) {
            delete state.maxScores.lastUpdated;
        }
    }
});
migrator.addMigration(5, (state) => {
    if (state.tournaments) {
        delete state.tournaments;
    }
});
export default migrator;