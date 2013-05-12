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
      // Version of this program.
      version           : "1.0.1",

      // Easy access to the document object.
	    document          : window.document,

      // Regular expression
      //   (C) http://www.regular-expressions.info/
      //fEmailAddress     = /[A-Za-z0-9._%+-]+@/,
      //fHost             = /@[A-Za-z0-9.-]+\./
      //fExtension        = /\.[A-Za-z]{2,4}/,

      fEmailAddresses   : /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/g,
      fAtSymbol         : /@/,
      fDot              : /\./,

      // The @ replacement options
      atOptions         : [" [at] ", " at ", "[at]", "&#" + "@".charCodeAt(0) + ";"],

      // The . replacement options
      dotOptions        : [" [dot] ", " dot ", "[dot]", "&#" + ".".charCodeAt(0) + ";"],

      /**
       * Options variable for any options.
       */
      options              : {
        // Replacement for the @
        "at-replacement"     : "",

        // Replacement for the .
        "dot-replacement"    : "",

        // The user's email address e.g: test    (from test@email.com)
        "email-address"      : "",

        // The host the email is from e.g: email (from test@email.com)
        "email-host"         : "",

        // The host's extension e.g: com         (from test@email.com)
        "email-extension"    : "",

        // The catalyst for the email that will be displayed to the users.
        "final-email"        : "",

        // The email that will be displayed in mailto: links. no way to really avoid that?
        "final-email-safe"   : ""
      },

      /**
       * Get an option from the @ category
       *   options         : the options to use
       *     at-replacement: returns override if set 
       */
      getAtOption       : function(options) {
        // If the user specifies a custom at-replacement, use that. else, use a random one.
        if (options["at-replacement"]) return options["at-replacement"];

        return jsem.atOptions[Math.floor(Math.random() * jsem.atOptions.length)];
      },

      /**
       * Get an option from the @ category
       *   options         : the options to use
       *     dot-replacement: returns override if set 
       */
      getDotOption       : function(options) {
        // If the user specifies a custom at-replacement, use that. else, use a random one.
        if (options["dot-replacement"]) return options["dot-replacement"];

        return jsem.dotOptions[Math.floor(Math.random() * jsem.dotOptions.length)];
      },

      /**
       * Mask an email address.
       *   email            : the email to mask.
       *   options          : the options to use.
       *     at-replacement : the replacement character(s) for the @
       *     dot-replacement: the replacement character(s) for the .
       */
      mask              : function(email, options) {
        if (typeof email === "undefined" || email == "") return;
        options = options ? options : this.options;

        // Start out with what they have.
        options["final-email"]      = email;

        options["email-address"]    = email.split("@")[0];
        options["email-host"]       = email.split("@")[1].split(".")[0];
        options["email-extension"]  = email.split("@")[1].split(".")[1];

        // Replace the email-address, email-host, etc, with
        options = jsem.replaceChars   (options);
        options = jsem.replaceAtSymbol(options);
        options = jsem.replaceDot     (options);

        return options["final-email"];
      },

      maskAll           : function(options) {
        options = options ? options : this.options;
        var addresses = document.body.innerHTML.match(jsem.fEmailAddresses);
        console.log(addresses);

        for (var i = 1; i < addresses.length; i++) {
          // for each address.. mask it.
          alert("Masking " + addresses[i]);
          document.body.innerHTML = document.body.innerHTML.replace(addresses[i], jsem.mask(addresses[i]));
        }
      },


      /** 
       * Replace the @
       */
      replaceAtSymbol   : function(options) {
        var replacement = jsem.getAtOption(options);
        options["final-email"] = options["final-email"].replace(jsem.fAtSymbol, replacement);
        return options;
      },

      /**
       * Replace the .
       */
      replaceDot        : function(options) {
        var replacement = jsem.getDotOption(options);
        options["final-email"] = options["final-email"].replace(jsem.fDot, replacement);
        return  options;
      },

      /**
       * Replace the rest of the characters.
       *   email  : at this point should be an array with 3 vars. [emailaddress, host, extension]
       */
      replaceChars      : function(options) {
        var newEmail    = "",
            newHost     = "",
            newExtension= "",
            email       = options["email-address"],
            host        = options["email-host"],
            extension   = options["email-extension"],
            i;

        for (i = 0; i < email.length; i++)
          newEmail += "&#" + email.charCodeAt(i) + ";";

        for (i = 0; i < host.length; i++)
          newHost += "&#" + host.charCodeAt(i) + ";";

        for (i = 0; i < extension.length; i++)
          newExtension += "&#" + extension.charCodeAt(i) + ";";

        options["final-email"].replace(email, newEmail).replace(host, newHost).replace(extension, newExtension);
        return options;
      }
};

window.jsem = jsem;