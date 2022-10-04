// #region Developer Information
/*
 ********************************************
    Author: Andrew Laychak
    Email: ALaychak@harriscomputer.com

    Created At: 11-02-2021 02:06:48 PM
    Last Modified: 09-30-2022 12:18:00 PM
    Last Updated By: Andrew Laychak

    Description: Get a directive by the name. The one from GraphQL Tools currently does *not* work properly (returns null)

    References:
      - https://github.com/MichalLytek/type-graphql/issues/965
 ********************************************
*/
// #endregion

// #region Imports
import type { DirectiveNode } from 'graphql';
// #endregion

// #region Get Directive
const getDirective = (directives: DirectiveNode[], name: string) =>
  directives.find((item) => item.name.value === name);
// #endregion

// #region Exports
export default getDirective;
// #endregion
