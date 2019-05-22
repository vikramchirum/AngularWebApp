(function (w, o) {
'use strict';
    o.ooCreateEntry = function() {
        if(typeof OOo.oo_entry === 'undefined') {
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
                    gexa_active_Service_account_id:  typeof localStorage !== "undefined" ? typeof localStorage.gexa_active_Service_account_id !== "undefined" ? localStorage.gexa_active_Service_account_id : "" : "",
                    user_email_address: typeof localStorage !== "undefined" ? typeof localStorage.user_email_address !== "undefined" ? localStorage.user_email_address : "" : ""
                }
            });
            if (typeof OOo !== 'undefined' && typeof OOo.releaseDetails !== 'object') { OOo.releaseDetails = []; }
            OOo.releaseDetails.push({
                    author: 'KS',
                    timeStamp: '01/04/2019, 13:50:09',
                    fileName: 'oo_conf_entry.js',
                    fileVersion: '2.0',
                    ticketNumber: 'VCS-5978',
                    gitDiff: 'c40e9ccc16ad2f000ec8a988cc589af925a98cff'
            });
        }
    };
})(window, OOo);