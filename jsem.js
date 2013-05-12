/**
 * jsem.js
 * 
 * Copyright (C) Daniel Davison
 * Description: JavaScript Email Masker
 *   A free, easy-to-use utility that is used to mask email address from bots and scanners
 *   using algorithms which choose random symbols to use.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
var jsem = jsem || {
  var 
      // Version of this program.
      version           = "1.0.0",

      // Easy access to the document object.
	    document          = window.document,

      // Regular expression
      //   (C) http://www.regular-expressions.info/
      //fEmailAddress     = /[A-Za-z0-9._%+-]+@/,
      //fHost             = /@[A-Za-z0-9.-]+\./
      //fExtension        = /\.[A-Za-z]{2,4}/,

      fEmailAddresses   = /[A-Za-z0-9._%+-]+@[A-Z0-9.-]+\.[A-Za-z]{2,4}/g,
      fAtSymbol         = /@/,
      fDot              = /\./,

      // The @ replacement options
      atOptions         = [" [at] ", " at ", "[at]", "@".charCodeAt(0)],

      // The . replacement options
      dotOptions       = [" [dot] ", " dot ", "[dot]", ".".charCodeAt(0)],

      /**
       * Options variable for any options.
       *   at-replacement: the replacement for the @ symbol.
       *   dot-repalcement: the replacement for the . symbol.
       *   email-address : the email address (anything before @)
       *   email-host    : the email host    (between the @ and .)
       *   email-extension : the email host's extension (.com, .org, etc)
       */
      options          = [],


      jsem             = function() {
        return this;
      },

      /**
       * Get an option from the @ category
       *   options         : the options to use
       *     at-replacement: returns override if set 
       */
      getAtOption       = function(options) {
        // If the user specifies a custom at-replacement, use that. else, use a random one.
        if (options["at-replacement"]) return options["at-replacement"];

        return atOptions[Math.floor(Math.random() * atOptions.length)];
      },

      /**
       * Get an option from the @ category
       *   options         : the options to use
       *     dot-replacement: returns override if set 
       */
      getDotOption       = function(options) {
        // If the user specifies a custom at-replacement, use that. else, use a random one.
        if (options["dot-replacement"]) return options["dot-replacement"];

        return atOptions[Math.floor(Math.random() * dotOptions.length)];
      },

      /**
       * Mask an email address.
       *   email            : the email to mask.
       *   options          : the options to use.
       *     at-replacement : the replacement character(s) for the @
       *     dot-replacement: the replacement character(s) for the .
       */
      mask              = function(email, options) {
        if (typeof email === "undefined" || email == "") return;

        var newEmail = "";

        options["email-address"]    = email.split("@")[0];
        options["email-host"]       = options["email-address"][1].split(".")[0];
        options["email-extension"]  = options["email-address"][1].split(".")[1];

        // Replace the email-address, email-host, etc, with
        options = replaceChars(options);

        newEmail = options["new-email-address"]    + 
                   replaceAtSymbol(email, options) +
                   options["new-email-host"]       +
                   replaceDot(email, options)      +
                   options["new-email-extension"];

        return newEmail;
      },


      /** 
       * Replace the @
       */
      replaceAtSymbol   = function(email, options) {
        if (typeof email === "undefined" || email == "") return;

        var replacement = getAtOption(options);
        return email.replace(fAtSymbol, replacement);
      },

      /**
       * Replace the .
       */
      replaceDot        = function(email, options) {
        if (typeof email === "undefined" || email == "") return;

        var replacement = options["dot-replacement"] ? options["dot-replacement"] : " [dot] ";
        return email.replace(fDot, replacement);
      },

      /**
       * Replace the rest of the characters.
       *   email  : at this point should be an array with 3 vars. [emailaddress, host, extension]
       */
      replaceChars      = function(options) {
        var newEmail    = "",
            newHost     = "",
            newExtension= "",
            email       = options["email-address"],
            host        = options["email-host"],
            extension   = options["email-extension"],
            i;

        for (i = 0; i < email.length; i++)
          newEmail += email.charAt(i).charCode(0);

        for (i = 0; i < host.length; i++)
          newHost += host.charAt(i).charCode(0);

        for (i = 0; i < extension.length; i++)
          newExtension += extension.charAt(i).charCode(0);

        options["new-email-address"]   = newEmail;
        options["new-email-host"]      = newHost;
        options["new-email-extension"] = newExtension;
        return options;
      }
};

window.jsem = jsem;