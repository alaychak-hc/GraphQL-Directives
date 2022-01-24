// #region Developer Information
/*
 ********************************************
    Author: Andrew Laychak
    Email: ALaychak@harriscomputer.com

    Created At: 01-24-2022 03:10:15 PM
    Last Modified: 01-24-2022 03:10:17 PM
    Last Updated By: Andrew Laychak

    Description: Get a directive by the name. The one from GraphQL Tools currently does *not* work properly (returns null)

    References:
      - https://github.com/MichalLytek/type-graphql/issues/965
 ********************************************
*/
// #endregion

// #region Imports
import { DirectiveNode } from 'graphql';
// #endregion

// #region Get Directive
const getDirective = (directives: DirectiveNode[], name: string) =>
  directives.find((item) => item.name.value === name);
// #endregion

// #region Exports
export default getDirective;
// #endregion
