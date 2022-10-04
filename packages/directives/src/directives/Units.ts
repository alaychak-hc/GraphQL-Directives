// #region ESLint Rules
/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment, class-methods-use-this */
// #endregion

// #region Developer Information
/*
 ********************************************
    Author: Xlantra1
    Email: Xlantra1@gmail.com

    Created At: 02-08-2021 12:42:03 PM
    Last Modified: 09-30-2022 03:51:38 PM
    Last Updated By: Andrew Laychak

    Description: Directive that handles unit conversions

    References:
      - Directives => https://github.com/Saeris/graphql-directives#formatdate
      - Math.js => https://github.com/josdejong/mathjs
 ********************************************
*/
// #endregion

// #region Imports
import type { GraphQLSchema } from 'graphql';
import { GraphQLString } from 'graphql';
import { unit } from 'mathjs';
import generateNewDirective from './Generate Directive.js';
// #endregion

// #region Unit Directive
/**
 * Directive that converts a number into various formats
 *
 * @see {@link Apollo} for more information on Directives
 * @see {@link https://www.apollographql.com/docs/apollo-server/schema/creating-directives/}
 */
// class UnitDirective extends SchemaDirectiveVisitor {
//   static getDirectiveDeclaration(directiveName: string): GraphQLDirective {
//     return new GraphQLDirective({
//       name: directiveName,
//       locations: [DirectiveLocation.FIELD_DEFINITION],
//     });
//   }

//   visitFieldDefinition(field: GraphQLField<unknown, unknown>): void {
//     const { resolve } = field;
//     const uField = field;
//     uField.isDeprecated = false;

//     uField.args.push({
//       name: 'unitFormat',
//       description: 'Converts the unit to the specified format',
//       type: GraphQLString,
//       defaultValue: '',
//       extensions: {},
//       astNode: undefined,
//       deprecationReason: null,
//     });

//     uField.resolve = async (source, { ...otherArgs }, context, info) => {
//       const result = await resolve?.call(
//         this,
//         source,
//         otherArgs,
//         context,
//         info
//       );

//       let cResult = '';
//       if (typeof result === 'number') {
//         cResult = result.toString();
//       } else if (typeof result === 'string') {
//         cResult = result;
//       }

//       // TODO: Implement this using https://mathjs.org/docs/datatypes/units.html
//       return cResult;
//     };
//   }
// }

const UnitDirective = (schema: GraphQLSchema) =>
  generateNewDirective(schema, {
    name: 'unit',
    args: [
      {
        inFormat: {
          description:
            'The format the input is in (e.g. cm, m, km). If not specified, the input is assumed to already be in the desired format',
          type: GraphQLString,
        },
      },
      {
        toFormat: {
          description: 'Formats the unit to the specified format',
          type: GraphQLString,
        },
      },
    ],
    resolveFn(result, otherArgs) {
      const { inFormat, toFormat } = otherArgs;

      if (!toFormat) {
        return result;
      }

      if (typeof result === 'number') {
        if (!inFormat) {
          throw new Error("The 'inFormat' argument is required");
        }
        return unit(result, inFormat).to(toFormat).toNumber();
      }

      if (typeof result === 'string') {
        if (!inFormat) {
          return unit(result).to(toFormat).toString();
        }

        return unit(Number(result), inFormat).to(toFormat).toString();
      }

      return result;
    },
  });
// #endregion

// #region Exports
export default UnitDirective;
// #endregion
