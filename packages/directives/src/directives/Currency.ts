// #region ESLint Rules
/* eslint-disable @typescript-eslint/no-unsafe-assignment, class-methods-use-this */
// #endregion

// #region Developer Information
/*
 ********************************************
    Author: Xlantra1
    Email: Xlantra1@gmail.com

    Created At: 02-08-2021 12:40:41 PM
    Last Modified: 09-30-2022 03:47:33 PM
    Last Updated By: Andrew Laychak

    Description: Directive that handles currency conversions

    References:
      - Directives => https://github.com/Saeris/graphql-directives#formatdate
      - Dinero.js => https://dinerojs.com/
      - Locales => https://github.com/ladjs/i18n-locales
 ********************************************
*/
// #endregion

// #region Imports
import type { GraphQLSchema } from 'graphql';
import { GraphQLInt, GraphQLString } from 'graphql';
import type { Currency } from 'dinero.js';
import Dinero from 'dinero.js';
import generateNewDirective from './Generate Directive.js';
// #endregion

// #region Currency Directive
/**
 * Directive that converts the result to a currency format (e.g. 10 => $10.00)
 *
 * @see {@link Apollo} for more information on Directives
 * @see {@link https://www.apollographql.com/docs/apollo-server/schema/creating-directives/}
 */
const CurrencyDirective = (schema: GraphQLSchema) =>
  generateNewDirective(schema, {
    name: 'currency',
    args: [
      {
        currencyFormat: {
          description: 'Formats the currency to the specified format',
          type: GraphQLString,
          defaultValue: 'USD',
        },
      },
      {
        currencyLocale: {
          description: 'Formats the currency locale',
          type: GraphQLString,
          defaultValue: 'en-US',
        },
      },
      {
        currencyInputPrecision: {
          description:
            'Sets the currency precision of the input value (e.g. 1 => 0.01, if precision is set to 2 or 1.00 if precision is set to 0)',
          type: GraphQLInt,
          defaultValue: 2,
        },
      },
      {
        currencyOutputFormat: {
          description: 'Sets the currency format of the output value',
          type: GraphQLString,
          defaultValue: '$0,0.00',
        },
      },
    ],
    resolveFn(result, otherArgs) {
      const {
        currencyFormat,
        currencyLocale,
        currencyInputPrecision,
        currencyOutputFormat,
      } = otherArgs;
      const dFormat = currencyFormat;
      const oCurrency = Dinero({
        amount: parseFloat(result as string),
        currency: dFormat as Currency | undefined,
        precision: Number(currencyInputPrecision),
      });
      let cFormatted = oCurrency.toFormat(currencyOutputFormat);

      if (currencyLocale) {
        cFormatted = oCurrency.getAmount().toLocaleString(currencyLocale, {
          style: 'currency',
          currency: currencyFormat,
        });
      }

      return cFormatted;
    },
  });
// #endregion

// #region Exports
export default CurrencyDirective;
// #endregion
