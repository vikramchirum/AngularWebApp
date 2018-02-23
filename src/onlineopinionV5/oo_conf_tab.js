/*
OnlineOpinion v5.9.9
Released: 08/02/2016. Compiled 08/02/2016 02:01:40 PM -0500
Branch: master 2a8b05f36a87035a4e8fac9b85c18815b63da4e3
Components: Full
UMD: disabled
The following code is Copyright 1998-2016 Opinionlab, Inc. All rights reserved. Unauthorized use is prohibited. This product and other products of OpinionLab, Inc. are protected by U.S. Patent No. 6606581, 6421724, 6785717 B1 and other patents pending. http://www.opinionlab.com
*/

/* global window, OOo */



/* [+] Tab configuration */
(function (w, o) {
    'use strict';

    var OpinionLabInit = function () {

        o.oo_tab = new o.Ocode({
            tab: {
                position: 'right',
                title: 'Feedback',
                tabType: 0,
                verbiage: 'Feedback',
                iconPath: './onlineopinionV5/' //for vertical tab only
            },
            disableMobile: false,
            disableShow: false,
            mobileTouches: 1,
            customVariables: {
                feedbackType: "tab",
                gexa_active_Service_account_id: typeof localStorage.gexa_active_Service_account_id !== "undefined" ? localStorage.gexa_active_Service_account_id : "",
                user_email_address: typeof localStorage.user_email_address !== "undefined" ? localStorage.user_email_address : ""
            }
        });

    };

    OpinionLabInit();

})(window, OOo);
