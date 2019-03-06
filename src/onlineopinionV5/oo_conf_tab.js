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
        o.tabFeedbackShow = function (event) {
            o.oo_tab = new o.Ocode({
                mobileTouches: 1,
                customVariables: {
                    feedbackType: "tab",
                    gexa_active_Service_account_id:  typeof localStorage !== "undefined" ? typeof localStorage.gexa_active_Service_account_id !== "undefined" ? localStorage.gexa_active_Service_account_id : "" : "",
                    user_email_address: typeof localStorage !== "undefined" ? typeof localStorage.user_email_address !== "undefined" ? localStorage.user_email_address : "" : ""
                }
            });
        
            o.oo_launch(event, 'oo_tab');
        }
        
        o.createTab = function () {
            var el,
                v_tab_cust = document.createElement('a'),
                v_span_screen_reader = document.createElement('span'),
                v_span_icon = document.createElement('span'),
                v_span_img = document.createElement('img')
            v_span_img.src = 'onlineopinionV5/oo_tab_icon_retina.gif';
            v_tab_cust.href = '#';
            v_tab_cust.id = 'oo_tab';
            v_tab_cust.className = 'oo_tab_right';
            v_tab_cust.style.index = '0';
            v_tab_cust.appendChild(v_span_img);
            v_tab_cust.innerHTML += 'Feedback';
            v_span_screen_reader.className = 'screen_reader';
            v_span_screen_reader.innerHTML = 'Launches comment card in new window';
        
            v_tab_cust.appendChild(v_span_screen_reader);
            v_tab_cust.appendChild(v_span_icon);
        
            document.body.appendChild(v_tab_cust);
            o.addEventListener(v_tab_cust, 'click', function (Event) {
                o.tabFeedbackShow(Event);
            }, false);
        }
        o.createTab();

        if (typeof OOo !== 'undefined' && typeof OOo.releaseDetails !== 'object') { OOo.releaseDetails = []; }
        OOo.releaseDetails.push({
              author: 'KS',
              timeStamp: '01/02/2019, 16:01:58',
              fileName: 'oo_conf_tab.js',
              fileVersion: '1.0',
              ticketNumber: 'VCS-5978',
              gitDiff: 'N/A'
        });
    };

    OpinionLabInit();

})(window, OOo);