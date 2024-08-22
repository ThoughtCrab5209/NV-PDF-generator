// Using the provided integer (see the config file), return the corresponding score to use
export const translatePlaceToScore = (place) => {
    switch (place) {
        case '1':
            return 16
        case '2':
            return 14
        case '3':
            return 12
        case '4':
            return 10
        case '5':
            return 8
        case '6':
            return 6
        case '7':
            return 4
        case '8':
            return 2
        default:
            return 0
    }
}