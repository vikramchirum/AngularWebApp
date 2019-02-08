/*
OnlineOpinion v5.9.9
Released: 08/02/2016. Compiled 08/02/2016 02:01:40 PM -0500
Branch: master 2a8b05f36a87035a4e8fac9b85c18815b63da4e3
Components: Full
UMD: disabled
The following code is Copyright 1998-2016 Opinionlab, Inc. All rights reserved. Unauthorized use is prohibited. This product and other products of OpinionLab, Inc. are protected by U.S. Patent No. 6606581, 6421724, 6785717 B1 and other patents pending. http://www.opinionlab.com
*/

(function (w, o) {
    'use strict';

    var OpinionLabInit = function () {
        // for SPA deployment, o.inlineFeedbackShow would be the function we tell clients to add to the onclick event of their inline link
        o.inlineFeedbackShow = function(event) {
            o.oo_feedback = new o.Ocode({
                customVariables: {
                    feedbackType: 'inline',
                    gexa_active_Service_account_id:  typeof localStorage !== "undefined" ? typeof localStorage.gexa_active_Service_account_id !== "undefined" ? localStorage.gexa_active_Service_account_id : "" : "",
                    user_email_address: typeof localStorage !== "undefined" ? typeof localStorage.user_email_address !== "undefined" ? localStorage.user_email_address : "" : ""
                }
            });

            // Now that oo_feedback has been re-initialized with the custom variable and contextual of the current page, launch the comment card
            o.oo_launch(event, 'oo_feedback');
        };

        o.oo_launch = function(e, feedback) {
            var evt = e || window.event;
            o[feedback].show(evt);
        };
        if (typeof OOo !== 'undefined' && typeof OOo.releaseDetails !== 'object') { OOo.releaseDetails = []; }
        OOo.releaseDetails.push({
              author: 'KS',
              timeStamp: '01/02/2019, 16:02:28',
              fileName: 'oo_conf_inline.js',
              fileVersion: '1.0',
              ticketNumber: 'VCS-5978',
              gitDiff: 'N/A'
        });
    };

    OpinionLabInit();

})(window, OOo);

