// #region ESLint Rules
/* eslint-disable @typescript-eslint/no-unsafe-assignment, class-methods-use-this */
// #endregion

// #region Developer Information
/*
 ********************************************
    Author: Xlantra1
    Email: Xlantra1@gmail.com

    Created At: 02-08-2021 12:41:34 PM
    Last Modified: 09-30-2022 03:48:53 PM
    Last Updated By: Andrew Laychak

    Description: Directive that handles phone number conversions

    References:
      - Directives => https://github.com/Saeris/graphql-directives#formatdate
      - LibPhoneNumber => https://github.com/catamphetamine/libphonenumber-js
 ********************************************
*/
// #endregion

// #region Imports
import type { GraphQLSchema } from 'graphql';
import { GraphQLString } from 'graphql';
import { CountryCode, NumberFormat, parsePhoneNumber } from 'libphonenumber-js';
import generateNewDirective from './Generate Directive.js';
// #endregion

// #region Phone Directive
/**
 * Directive that is able to format the result to a phone number (national or international).
 *
 * @see {@link Apollo} for more information on Directives
 * @see {@link https://www.apollographql.com/docs/apollo-server/schema/creating-directives/}
 */
const PhoneDirective = (schema: GraphQLSchema) =>
  generateNewDirective(schema, {
    name: 'phone',
    args: [
      {
        phoneNumberFormat: {
          description: 'Formats the phone number to the specified format',
          type: GraphQLString,
          defaultValue: 'NATIONAL',
        },
      },
      {
        phoneNumberCountry: {
          description: 'Sets the country code for the phone number',
          type: GraphQLString,
          defaultValue: 'US',
        },
      },
    ],
    resolveFn(result, otherArgs) {
      const { phoneNumberFormat, phoneNumberCountry } = otherArgs;

      if (result && typeof result === 'string') {
        const pNumber = parsePhoneNumber(
          result,
          phoneNumberCountry as CountryCode
        );

        return pNumber.format(phoneNumberFormat as NumberFormat);
      }

      return result;
    },
  });
// #endregion

// #region Exports
export default PhoneDirective;
// #endregion
