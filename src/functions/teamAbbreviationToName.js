// Using the provided abbreviation, return the corresponding full society name
export const teamAbbreviationToName = (abbrev) => {
    switch (abbrev) {
        case 'AIRTEC':
            return 'Airsoft x TEC'
        case 'ANI':
            return 'Anime'
        case 'CHLNGR':
            return 'Challengers'
        case 'CRI':
            return 'CRITS'
        case 'WHO':
            return 'Doctor Who'
        case 'FLMCRW':
            return 'Film x Creative Writing'
        case 'GAMESP':
            return 'Gaming x Esports'
        case 'SCF':
            return 'Sci-Fan'
        default:
            return ''
    }
}