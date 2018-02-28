/*
OnlineOpinion v5.9.9
Released: 08/02/2016. Compiled 08/02/2016 02:01:40 PM -0500
Branch: master 2a8b05f36a87035a4e8fac9b85c18815b63da4e3
Components: Full
UMD: disabled
The following code is Copyright 1998-2016 Opinionlab, Inc. All rights reserved. Unauthorized use is prohibited. This product and other products of OpinionLab, Inc. are protected by U.S. Patent No. 6606581, 6421724, 6785717 B1 and other patents pending. http://www.opinionlab.com
*/

/* global window, OOo */



/*
Inline configuration
*********************
Object is now being instantiated against the OOo object (1 global class)
To call this object, place the below in the click event
OOo.oo_launch(event, 'oo_feedback1')
*/
(function (w, o) {
    'use strict';

    var OpinionLabInit = function () {


        o.oo_feedback = new o.Ocode({
            customVariables: {
                feedbackType: 'inline',
                gexa_active_Service_account_id: typeof localStorage.gexa_active_Service_account_id !== "undefined" ? localStorage.gexa_active_Service_account_id : '',
                user_email_address: typeof localStorage.user_email_address !== "undefined" ? localStorage.user_email_address : ''
            }
        });

        o.oo_launch = function(e, feedback) {
            var evt = e || window.event;
            o[feedback].show(evt);
        };

    };

    OpinionLabInit();

})(window, OOo);
