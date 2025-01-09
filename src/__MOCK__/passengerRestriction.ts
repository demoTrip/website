export const passengerRestrictionRule = {
    adultNameRestriction: {
        fullNameMinLength: 4,
        fullNameMaxLength: 26,
        familyNameMinLength: 2,
        familyNameMaxLength: 25,
        givenNameMinLength: 1,
        givenNameMaxLength: 24
    },
    childNameRestriction: {
        fullNameMinLength: 4,
        fullNameMaxLength: 25,
        familyNameMinLength: 2,
        familyNameMaxLength: 24,
        givenNameMinLength: 1,
        givenNameMaxLength: 23
    },
    infantNameRestriction: {
        fullNameMinLength: 4,
        fullNameMaxLength: 18,
        familyNameMinLength: 2,
        familyNameMaxLength: 17,
        givenNameMinLength: 1,
        givenNameMaxLength: 16
    }
}