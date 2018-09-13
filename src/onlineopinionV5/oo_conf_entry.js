(function (w, o) {
    'use strict';

    var OpinionLabInit = function () {

        if (typeof OOo !== 'undefined' && typeof OOo.releaseDetails !== 'object') { OOo.releaseDetails = []; }
        OOo.releaseDetails.push({
            author: '',
            timeStamp: '8/14/2018, 4:00:56 PM',
            fileName: 'oo_conf_entry.js',
            fileVersion: '1.0',
            ticketNumber: 'IMP-3427',
            gitDiff: 'N/A'
        });

        o.oo_entry = new o.Ocode({
            events: {
                onEntry: 100,
                delayEntry: 15,
                prompt: {
                  promptMarkup: "<div id='oo_entry_prompt' role='dialog' aria-describedby='oo_entry_message'><div id='oo_entry_company_logo'></div><div id='oo_entry_content'><p id='oo_entry_message'>Thank you for using Power Usage Tracker, our new online energy management tool!<br /><br />Would you be willing to provide feedback on your experience?</p><p class='entry_prompt_button'><a href='#' id='oo_launch_entry_prompt'>Yes<span class='screen_reader'>This will open a new window</span></a></p><p class='entry_prompt_button'><a href='#' id='oo_entry_no_thanks'>No Thanks</a></p><p id='ol_entry_brand_logo'><span aria-label='Powered by OpinionLab.'></span></p></div><a id='oo_entry_close_prompt' href='#' aria-label='Close dialog'><div class='screen_reader'>Close dialog</div><span aria-hidden='true'>&#10006;</span></a></div><!--[if IE 8]><style>/* IE 8 does not support box-shadow */#oo_entry_prompt #oo_entry_content { width: 400px; padding: 40px 49px 20px 49px; border: 1px solid #ccc; }</style><![endif]-->",
                  pathToAssets: './onlineopinionV5/',
                  companyLogo: './onlineopinionV5/logo.jpg',
                  companySlogan: 'We value your opinion!',
                }
            },
            cookie: {
                name: 'oo_entry',
                type: 'domain',
                expiration: 1728000
            },
            referrerRewrite: {
                searchPattern: /:\/\/[^\/]*/,
                replacePattern: '://trackerprompt.gexa.com'
            },
            customVariables: {
                gexa_active_Service_account_id: function() { return typeof localStorage.gexa_active_Service_account_id !== "undefined" ? localStorage.gexa_active_Service_account_id : ""; },
                user_email_address: function() { return typeof localStorage.user_email_address !== "undefined" ? localStorage.user_email_address : ""; }
            }
        });
    };

    o.addEventListener(w, 'load', OpinionLabInit, false);

})(window, OOo);