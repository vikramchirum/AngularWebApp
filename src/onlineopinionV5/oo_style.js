/*
OnlineOpinion v5.9.9
Released: 08/02/2016. Compiled 08/02/2016 02:01:40 PM -0500
Branch: master 2a8b05f36a87035a4e8fac9b85c18815b63da4e3
Components: Full
UMD: disabled
The following code is Copyright 1998-2016 Opinionlab, Inc. All rights reserved. Unauthorized use is prohibited. This product and other products of OpinionLab, Inc. are protected by U.S. Patent No. 6606581, 6421724, 6785717 B1 and other patents pending. http://www.opinionlab.com
*/
/* Define Paths to Image Assets */

var
  pathToAssets = 'onlineopinionV5/',
  bar_gif = pathToAssets + 'oo_bar_icon.gif',
  float_gif = pathToAssets + 'oo_float_icon.gif',
  loading_gif = pathToAssets + 'oo_loading.gif',
  tab_1_gif = pathToAssets + 'oo_tab_icon_1.gif',
  bar_gif_retina = pathToAssets + 'oo_bar_icon_retina.gif',
  float_gif_retina = pathToAssets + 'oo_float_icon_retina.gif',
  tab_1_gif_retina = pathToAssets + 'oo_tab_icon_1_retina.gif';

/* Create and Append Style Element */
var css = document.createElement("style");
css.setAttribute('type', 'text/css');
document.getElementsByTagName('head')[0].appendChild(css);

cssText = "\n#oo_invitation_company_logo img#oo_waypoint_company_logo img { max-height: 100%; max-width: 100%; height: auto; width: auto; /* ie8 */ }";

cssText += "\n#oo_feedback_fl_spacer { display: block; height: 1px; position: absolute; top: 0; width: 100px; }";

cssText += "\n.oo_feedback_float { width: 100px; height: 50px; overflow: hidden; font: 12px Tahoma, Arial, Helvetica, sans-serif; text-align: center; color: #252525; cursor: pointer; z-index: 999997; position: fixed; bottom: 5px; border: 1px solid #cccccc; border-radius: 9px; -moz-border-radius: 9px; -webkit-border-radius: 9px; right: 10px; -webkit-transition: -webkit-transform 0.3s ease; }";
cssText += "\n.oo_feedback_float .screen_reader { position: absolute; clip: rect(1px 1px 1px 1px); /* for Internet Explorer */ clip: rect(1px, 1px, 1px, 1px); padding: 0; border: 0; height: 1px; width: 1px; overflow: hidden; }";
cssText += "\n.oo_feedback_float .olUp { width: 100%; height: 100%; background: url(" + float_gif + ") center 10px no-repeat; text-align: center; padding: 31px 0 5px 0; position: relative; z-index: 2; filter: alpha(opacity=100); opacity: 1; transition: opacity .5s; -moz-transition: opacity .5s; -webkit-transition: opacity .5s; -o-transition: opacity .5s; }";
cssText += "\n.oo_feedback_float .olUp img { margin-bottom: 5px; }";
cssText += "\n.oo_feedback_float .oo_transparent { display: block; background: white; position: absolute; top: 0; left: 0; height: 100%; width: 100%; z-index: 1; opacity: 0.8; filter: alpha(opacity=80); border-radius: 8px; -moz-border-radius: 8px; -webkit-border-radius: 8px; }";
cssText += "\n.oo_feedback_float:hover .oo_transparent { opacity: 1.0; filter: alpha(opacity=100); }";
cssText += "\n.oo_feedback_float:hover .olUp { display: block; opacity: 0; filter: alpha(opacity=0); }";
cssText += "\n.oo_feedback_float .fbText { display: block; }";
cssText += "\n.oo_feedback_float .olOver { display: block; height: 100%; width: 100%; position: absolute; top: 0; left: 0; min-height: 50px; z-index: 2; opacity: 0; filter: alpha(opacity=0); transition: opacity .5s; -moz-transition: opacity .5s; -webkit-transition: opacity .5s; -o-transition: opacity .5s; }";
cssText += "\n.oo_feedback_float .olOver span { display: block; padding: 10px 5px; }";
cssText += "\n.oo_feedback_float:hover .olOver { opacity: 1.0; filter: alpha(opacity=100); top: 0; }";

cssText += "\n.oo_cc_wrapper { left: 0; padding: 0; position: fixed; text-align: center; top: 25px; width: 100%; z-index: 999999; }";
cssText += "\n.oo_cc_wrapper .screen_reader { position: absolute; clip: rect(1px 1px 1px 1px); /* for Internet Explorer */ clip: rect(1px, 1px, 1px, 1px); padding: 0; border: 0; height: 1px; width: 1px; overflow: hidden; }";
cssText += "\n.oo_cc_wrapper span { width: 100%; height: 100%; position: absolute; left: 0; top: 0; z-index: 1; }";
cssText += "\n.oo_cc_wrapper .iwrapper { background-color: white; margin: 0 auto; position: relative; width: 535px; z-index: 2; box-shadow: 0px 1px 3px 0px rgba(102, 102, 102, 0.3); -moz-box-shadow: 0px 1px 3px 0px rgba(102, 102, 102, 0.3); -webkit-box-shadow: 0px 1px 3px 0px rgba(102, 102, 102, 0.3); }";
cssText += "\n.oo_cc_wrapper iframe { position: relative; border: none; width: 100%; z-index: 4; }";
cssText += "\n.oo_cc_wrapper .oo_cc_close { position: absolute; display: block; right: 20px; top: 5px; font: 1em/1.5em 'HelveticaNeue-Medium', Helvetica, Arial, sans-serif; text-align: center; z-index: 5; color: black; text-decoration: none; cursor: pointer; }";

cssText += "\n#oo_bar { padding: 10px 35px; cursor: pointer; color: white; border-top: 1px solid white; background-color: black; bottom: 0; display: block; font: 16px 'HelveticaNeue-Medium', Helvetica, Arial, sans-serif; left: 0; text-decoration: none; line-height: 16px; position: fixed; text-align: left; width: 100%; z-index: 999997; box-shadow: rgba(0, 0, 0, 0.5) 0px -1px 2px; -moz-box-shadow: rgba(0, 0, 0, 0.5) 0px -1px 2px; -webkit-box-shadow: rgba(0, 0, 0, 0.5) 0px -1px 2px; }";
cssText += "\n#oo_bar span.icon { background-image: url(" + bar_gif + "); background-repeat: no-repeat; position: absolute; left: 8px; top: 9px; width: 19px; height: 17px; }";
cssText += "\n#oo_bar .screen_reader { position: absolute; clip: rect(1px 1px 1px 1px); /* for Internet Explorer */ clip: rect(1px, 1px, 1px, 1px); padding: 0; border: 0; height: 1px; width: 1px; overflow: hidden; }";
cssText += "\n#oo_bar:focus { outline: 3px solid #51ace9; }";

cssText += "\n.oo_bar { padding-bottom: 37px; }";

cssText += "\n#oo_tab { display: block; position: fixed; background-color: #2eb134; color: #ffffff; border: 1px solid #cccccc; font-size: 15px; font-family: Arial; line-height: 15px; opacity: 1; z-index: 999995; cursor: pointer; text-decoration: none; -webkit-backface-visibility: hidden; backface-visibility: hidden; transform: rotate(-90deg); -ms-transform: rotate(-90deg) scale(1.02); -webkit-transform: rotate(-90deg); -moz-transform: rotate(-90deg); transition: all .5s ease; -moz-transition: all .5s ease; -webkit-transition: all .5s ease; -o-transition: all .5s ease; }";
cssText += "\n#oo_tab .screen_reader { position: absolute; clip: rect(1px 1px 1px 1px); /* for Internet Explorer */ clip: rect(1px, 1px, 1px, 1px); padding: 0; border: 0; height: 1px; width: 1px; overflow: hidden; }";
cssText += "\n#oo_tab.oo_tab_right { right: -8px; top: 33%; padding: 5px 14px 14px 14px; border-bottom: 0px; color: white; border-radius: 9px 9px 0px 0px; -moz-border-radius: 9px 9px 0px 0px; -webkit-border-radius: 9px 9px 0px 0px; transform-origin: 100% 100% 0; -webkit-transform-origin: 100% 100% 0; -ms-transform-origin: 100% 100% 0; }";
cssText += "\n#oo_tab.oo_tab_right:hover, #oo_tab.oo_tab_right:focus, #oo_tab.oo_tab_right:active { -ms-transform: rotate(-90deg) scale(1.02) translateY(-5px); -webkit-transform: rotate(-90deg) translateY(-5px); -moz-transform: rotate(-90deg) translateY(-5px); }";
cssText += "\n#oo_tab.oo_tab_left { left: -12px; top: 62%; padding: 17px 12px 5px 13px; color: white; border-top: 0px; border-radius: 0px 0px 9px 9px; -moz-border-radius: 0px 0px 9px 9px; -webkit-border-radius: 0px 0px 9px 9px; transform-origin: 0 0; -webkit-transform-origin: 0 0; -ms-transform-origin: 0 0; }";
cssText += "\n#oo_tab.oo_tab_left:hover, #oo_tab.oo_tab_left:focus, #oo_tab.oo_tab_left:active {-ms-transform: rotate(-90deg) scale(1.02) translateY(5px); -webkit-transform: rotate(-90deg) translateY(5px); -moz-transform: rotate(-90deg) translateY(5px); }";
cssText += "\n#oo_tab img { width: 9px; height: 9px; margin-right: 7px; margin-bottom: 1px; color: transparent; border: none; transform: translateZ(0); -webkit-transform: translateZ(0); -ms-transform: translateZ(0); }";
cssText += "\n#oo_tab.oo_tab_left.oo_legacy { top: auto; right: auto; bottom: -5px; left: 20px; padding: 10px 10px 15px 10px; z-index: 999995; cursor: pointer; border-bottom: 0px; border-radius: 9px 9px 0 0; -moz-border-radius: 9px 9px 0 0; -webkit-border-radius: 9px 9px 0 0; transform: rotate(0deg); -ms-transform: rotate(0deg); -webkit-transform: rotate(0deg); -moz-transform: rotate(0deg); }";
cssText += "\n#oo_tab.oo_tab_right.oo_legacy { top: auto; bottom: -5px; right: 20px; padding: 10px 10px 15px 10px; z-index: 999995; cursor: pointer; border-bottom: 0px; transform: rotate(0deg); -ms-transform: rotate(0deg); -webkit-transform: rotate(0deg); -moz-transform: rotate(0deg); }";
cssText += "\n#oo_tab.oo_legacy img { top: 12px !important; }";
cssText += "\n#oo_tab.oo_tab_right.oo_legacy:hover, #oo_tab.oo_tab_right.oo_legacy:focus, #oo_tab.oo_tab_right.oo_legacy:active { bottom: 0; }";
cssText += "\n#oo_tab.oo_tab_left.oo_legacy:hover, #oo_tab.oo_tab_left.oo_legacy:focus, #oo_tab.oo_tab_left.oo_legacy:active { bottom: 0; }";
cssText += "\n@media only screen and (max-width: 991px) { #oo_tab { display: none; } }";

cssText += "\n#oo_tab_1 { background-color: black; border: 1px solid #ffffff; display: block; position: fixed; top: 40%; padding: 10px 0px 10px 0px; width: 124px; z-index: 999995; cursor: pointer; text-decoration: none; text-align: left; font-family: 'HelveticaNeue-Medium', Helvetica, Arial, sans-serif; line-height: 16px; font-size: 16px; color: #fff; }";
cssText += "\n#oo_tab_1:focus { outline: 3px solid #51ace9; }";
cssText += "\n#oo_tab_1 span.screen_reader { position: absolute; clip: rect(1px 1px 1px 1px); /* for Internet Explorer */ clip: rect(1px, 1px, 1px, 1px); padding: 0; border: 0; height: 1px; width: 1px; overflow: hidden; }";
cssText += "\n#oo_tab_1.oo_tab_right_1 { right: -9px; transition: right 1.5s; -moz-transition: right 1.5s; -webkit-transition: right 1.5s; padding: 10px 0px 10px 35px; box-shadow: rgba(0, 0, 0, 0.5) 1px 1px 2px; -moz-box-shadow: rgba(0, 0, 0, 0.5) 1px 1px 2px; -webkit-box-shadow: rgba(0, 0, 0, 0.5) 1px 1px 2px; width: 89px; }";
cssText += "\n#oo_tab_1.oo_tab_right_1 span.icon { background-image: url(" + tab_1_gif + "); background-repeat: no-repeat; position: absolute; left: 8px; top: 9px; width: 19px; height: 17px; }";
cssText += "\n#oo_tab_1.oo_tab_right_1.small { right: -90px; }";
cssText += "\n#oo_tab_1.oo_tab_right_1.small:hover { right: -9px; }";
cssText += "\n#oo_tab_1.oo_tab_left_1 { left: -9px; transition: left 1.5s; -moz-transition: left 1.5s; -webkit-transition: left 1.5s; padding: 10px 0px 10px 15px; box-shadow: rgba(0, 0, 0, 0.5) -1px 1px 2px; -moz-box-shadow: rgba(0, 0, 0, 0.5) -1px 1px 2px; -webkit-box-shadow: rgba(0, 0, 0, 0.5) -1px 1px 2px; width: 109px; }";
cssText += "\n#oo_tab_1.oo_tab_left_1 span.icon { background-image: url(" + tab_1_gif + "); background-repeat: no-repeat; position: absolute; right: 8px; top: 9px; width: 19px; height: 17px; }";
cssText += "\n#oo_tab_1.oo_tab_left_1.small { left: -90px; }";
cssText += "\n#oo_tab_1.oo_tab_left_1.small:hover { left: -9px; }";

cssText += "\n#oo_container { position: fixed; height: 100%; width: 100%; top: 0; left: 0; z-index: 999999; }";

cssText += "\n#oo_invitation_prompt { background: #fff; box-shadow: 0px 1px 3px 0px rgba(102, 102, 102, 0.3); -moz-box-shadow: 0px 1px 3px 0px rgba(102, 102, 102, 0.3); -webkit-box-shadow: 0px 1px 3px 0px rgba(102, 102, 102, 0.3); margin: 5% auto; text-align: left; position: relative; width: 500px; z-index: 999999; }";
cssText += "\n#oo_invitation_prompt #oo_invitation_company_logo { width: 100%; height: 120px; background: black; }";
cssText += "\n#oo_invitation_prompt #oo_invitation_company_logo img { height: 100%; }";
cssText += "\n#oo_invitation_prompt #oo_invite_content { width: 80%; padding: 40px 10% 20px 10%; box-shadow: inset 0px 0px 0px 1px #ccc; -webkit-box-shadow: inset 0px 0px 0px 1px #ccc; -moz-box-shadow: inset 0px 0px 0px 1px #ccc; }";
cssText += "\n#oo_invitation_prompt #oo_invite_content p { color: black; font: 1em/1.5em 'HelveticaNeue-Medium', Helvetica, Arial, sans-serif; margin: 0; padding: 0 0 20px 0; }";
cssText += "\n#oo_invitation_prompt #oo_invite_content p.prompt_button a { text-align: center; color: white; text-decoration: none; font-size: 1.5em; line-height: 1.2em; padding: 12px 0 13px 0; display: block; height: 25px; }";
cssText += "\n#oo_invitation_prompt #oo_invite_content a { cursor: pointer; }";
cssText += "\n#oo_invitation_prompt #oo_invite_content a:focus { outline: 3px solid #51ace9; }";
cssText += "\n#oo_invitation_prompt #oo_invite_content a#oo_launch_prompt { background: #cb352d; }";
cssText += "\n#oo_invitation_prompt #oo_invite_content a#oo_no_thanks { background: #707070; }";
cssText += "\n#oo_invitation_prompt #oo_invite_content #ol_invitation_brand_logo { text-align: center; border-top: 1px solid #ccc; line-height: 1.5em; margin: 20px 0 0 0; padding: 20px 0 0 0; }";
cssText += "\n#oo_invitation_prompt #oo_invite_content #ol_invitation_brand_logo img { height: 25px; width: 146px; border: 0px; }";
cssText += "\n#oo_invitation_prompt #oo_invite_content #ol_invitation_brand_logo a { display: block; height: 25px; }";
cssText += "\n#oo_invitation_prompt #oo_close_prompt { font-family: 'Zapf Dingbats'; position: absolute; display: block; right: 13px; top: 13px; line-height: 1em; font-size: 1em; color: white; text-decoration: none; }";
cssText += "\n#oo_invitation_prompt #oo_close_prompt:focus { outline: none; }";
cssText += "\n#oo_invitation_prompt #oo_close_prompt:focus span { outline: 3px solid #51ace9; }";
cssText += "\n#oo_invitation_prompt .screen_reader { position: absolute; clip: rect(1px 1px 1px 1px); /* for Internet Explorer */ clip: rect(1px, 1px, 1px, 1px); padding: 0; border: 0; height: 1px; width: 1px; overflow: hidden; }";

/* Android, iPhone 6 ----------- */
cssText += "\n@media only screen and (max-device-width: 480px), screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) { #oo_invitation_prompt { width: 90%; }";
cssText += "\n#oo_invitation_prompt #oo_invitation_company_logo { height: 80px; } }";
/* iPhone 5, 4 ----------- */
cssText += "\n@media only screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2), screen and (device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 2) { #oo_invitation_prompt { width: 90%; height: 90%; overflow-y: scroll; overflow-x: hidden; }";
cssText += "\n#oo_invitation_prompt #oo_invitation_company_logo { height: 80px; }";
cssText += "\n#oo_invitation_prompt #oo_invite_content { padding: 20px 10% 20px 10%; }";
cssText += "\n#oo_invitation_prompt #oo_invite_content #ol_invite_brand_logo { margin: 0 0 0 0; } }";
/* iPhone 4 only ----------- */
cssText += "\n@media screen and (device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 2) { #oo_invitation_promp #oo_close_prompt { right: -70px; } }";
cssText += "\n#oo_waypoint_container { position: fixed; height: 100%; width: 100%; top: 0; left: 0; z-index: 999999; }";

cssText += "\n#oo_waypoint_prompt { background: #fff; box-shadow: 0px 1px 3px 0px rgba(102, 102, 102, 0.3); -moz-box-shadow: 0px 1px 3px 0px rgba(102, 102, 102, 0.3); -webkit-box-shadow: 0px 1px 3px 0px rgba(102, 102, 102, 0.3); margin: 5% auto; text-align: left; position: relative; width: 500px; z-index: 999999; }";
cssText += "\n#oo_waypoint_prompt #oo_waypoint_company_logo { width: 100%; height: 120px; background: black; }";
cssText += "\n#oo_waypoint_prompt #oo_waypoint_company_logo img { height: 100%; }";
cssText += "\n#oo_waypoint_prompt #oo_waypoint_content { width: 80%; padding: 30px 10% 20px 10%; box-shadow: inset 0px 0px 0px 1px #ccc; -webkit-box-shadow: inset 0px 0px 0px 1px #ccc; -moz-box-shadow: inset 0px 0px 0px 1px #ccc;}";
cssText += "\n#oo_waypoint_prompt #oo_waypoint_content a { cursor: pointer; }";
cssText += "\n#oo_waypoint_prompt #oo_waypoint_content a:focus { outline: 3px solid #51ace9; }";
cssText += "\n#oo_waypoint_prompt #oo_waypoint_content p { color: black; font: 1em/1.5em Helvetica, Arial, sans-serif; margin: 0; padding: 0 0 20px 0; text-align: center; }";
cssText += "\n#oo_waypoint_prompt #oo_waypoint_content p#oo_waypoint_message { font-size: 1.2em; }";
cssText += "\n#oo_waypoint_prompt #oo_waypoint_content a.waypoint_icon { cursor: pointer; text-decoration: none; font-size: 1.5em; line-height: 1.2em; padding: 12px 0 13px 90px; display: block; height: 25px; color: white; margin-bottom: 20px; background-color: #cb352d; text-align: left; background-repeat: no-repeat; background-position: left center; background-size: 70px 50px; }";
cssText += "\n#oo_waypoint_prompt #oo_waypoint_content a.waypoint_icon.last { margin-bottom: 0; }";
cssText += "\n#oo_waypoint_prompt #oo_waypoint_content #ol_waypoint_brand_logo { line-height: 1.5em; margin: 10px 0 0 0; padding: 20px 0 0 0; }";
cssText += "\n#oo_waypoint_prompt #oo_waypoint_content #ol_waypoint_brand_logo img { height: 25px; width: 146px; border: 0px; }";
cssText += "\n#oo_waypoint_prompt #oo_waypoint_content #ol_waypoint_brand_logo a { display: block; height: 25px; }";
cssText += "\n#oo_waypoint_prompt #oo_waypoint_close_prompt { font-family: 'Zapf Dingbats'; position: absolute; display: block; right: 13px; top: 13px; line-height: 1em; font-size: 1em; color: white; text-decoration: none; }";
cssText += "\n#oo_waypoint_prompt #oo_waypoint_close_prompt:focus { outline: none; }";
cssText += "\n#oo_waypoint_prompt #oo_waypoint_close_prompt:focus span { outline: 3px solid #51ace9; }";
cssText += "\n#oo_waypoint_prompt .screen_reader { position: absolute; clip: rect(1px 1px 1px 1px); /* for Internet Explorer */ clip: rect(1px, 1px, 1px, 1px); padding: 0; border: 0; height: 1px; width: 1px; overflow: hidden; }";

/* Android, iPhone 6 ----------- */
cssText += "\n@media only screen and (max-device-width: 480px), screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) { #oo_waypoint_prompt { width: 90%; }";
cssText += "\n#oo_waypoint_prompt #oo_waypoint_company_logo { height: 80px; } }";
/* iPhone 5, 4 ----------- */
cssText += "\n@media only screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2), screen and (device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 2) { #oo_waypoint_prompt { width: 90%; height: 90%; overflow-y: scroll; overflow-x: hidden; }";
cssText += "\n#oo_waypoint_prompt #oo_waypoint_company_logo { height: 80px; }";
cssText += "\n#oo_waypoint_prompt #oo_waypoint_content { padding: 20px 10% 20px 10%; }";
cssText += "\n#oo_waypoint_prompt #oo_waypoint_content #ol_waypoint_brand_logo { margin: 0 0 0 0; } }";
/* iPhone 4 only ----------- */
cssText += "\n@media screen and (device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 2) { #oo_waypoint_promp #oo_waypoint_close_prompt { right: -70px; } }";
cssText += "\n#oo_entry_prompt { background: #fff; box-shadow: 0px 1px 3px 0px rgba(102, 102, 102, 0.3); -moz-box-shadow: 0px 1px 3px 0px rgba(102, 102, 102, 0.3); -webkit-box-shadow: 0px 1px 3px 0px rgba(102, 102, 102, 0.3); margin: 5% auto; text-align: left; position: relative; width: 500px; z-index: 999999; }";
cssText += "\n#oo_entry_prompt #oo_entry_company_logo { width: 100%; height: 120px; background: black; }";
cssText += "\n#oo_entry_prompt #oo_entry_company_logo img { height: 100%; }";
cssText += "\n#oo_entry_prompt #oo_entry_content { width: 80%; padding: 40px 10% 20px 10%; box-shadow: inset 0px 0px 0px 1px #ccc; -webkit-box-shadow: inset 0px 0px 0px 1px #ccc; -moz-box-shadow: inset 0px 0px 0px 1px #ccc; }";
cssText += "\n#oo_entry_prompt #oo_entry_content p { color: black; font: 1em/1.5em 'HelveticaNeue-Medium', Helvetica, Arial, sans-serif; margin: 0; padding: 0 0 20px 0; }";
cssText += "\n#oo_entry_prompt #oo_entry_content p.entry_prompt_button a { text-align: center; color: white; text-decoration: none; font-size: 1.5em; line-height: 1.2em; padding: 12px 0 13px 0; display: block; height: 25px; }";
cssText += "\n#oo_entry_prompt #oo_entry_content a { cursor: pointer; }";
cssText += "\n#oo_entry_prompt #oo_entry_content a:focus { outline: 3px solid #51ace9; }";
cssText += "\n#oo_entry_prompt #oo_entry_content a#oo_launch_entry_prompt { background: #cb352d; }";
cssText += "\n#oo_entry_prompt #oo_entry_content a#oo_entry_no_thanks { background: #707070; }";
cssText += "\n#oo_entry_prompt #oo_entry_content #ol_entry_brand_logo { text-align: center; border-top: 1px solid #ccc; line-height: 1.5em; margin: 20px 0 0 0; padding: 20px 0 0 0; }";
cssText += "\n#oo_entry_prompt #oo_entry_content #ol_entry_brand_logo img { height: 25px; width: 146px; border: 0px; }";
cssText += "\n#oo_entry_prompt #oo_entry_content #ol_entry_brand_logo a { display: block; height: 25px; }";
cssText += "\n#oo_entry_prompt #oo_entry_close_prompt { font-family: 'Zapf Dingbats'; position: absolute; display: block; right: 13px; top: 13px; line-height: 1em; font-size: 1em; color: white; text-decoration: none; }";
cssText += "\n#oo_entry_prompt #oo_entry_close_prompt:focus { outline: none; }";
cssText += "\n#oo_entry_prompt #oo_entry_close_prompt:focus span { outline: 3px solid #51ace9; }";
cssText += "\n#oo_entry_prompt .screen_reader { position: absolute; clip: rect(1px 1px 1px 1px); /* for Internet Explorer */ clip: rect(1px, 1px, 1px, 1px); padding: 0; border: 0; height: 1px; width: 1px; overflow: hidden; }";

/* Android, iPhone 6 ----------- */
cssText += "\n@media only screen and (max-device-width: 480px), screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) { #oo_entry_prompt { width: 90%; }";
cssText += "\n#oo_entry_prompt #oo_entry_company_logo { height: 80px; } }";
/* iPhone 5, 4 ----------- */
cssText += "\n@media only screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2), screen and (device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 2) { #oo_entry_prompt { width: 90%; height: 90%; overflow-y: scroll; overflow-x: hidden; }";
cssText += "\n#oo_entry_prompt #oo_entry_company_logo { height: 80px; }";
cssText += "\n#oo_entry_prompt #oo_entry_content { padding: 20px 10% 20px 10%; }";
cssText += "\n#oo_entry_prompt #oo_entry_content #ol_entry_brand_logo { margin: 0 0 0 0; } }";
/* iPhone 4 only ----------- */
cssText += "\n@media screen and (device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 2) { #oo_entry_promp #oo_entry_close_prompt { right: -70px; } }";
cssText += "\n#oo_overlay, #oo_invitation_overlay, #oo_waypoint_overlay, #oo_entry_overlay { background: white url(" + loading_gif + ") 50% 80px no-repeat; display: block; height: 1000%; left: 0; position: fixed; top: 0; width: 100%; z-index: 999998; opacity: 0.5; filter: alpha(opacity=50); }";
cssText += "\n#oo_overlay.no_loading, #oo_invitation_overlay.no_loading, #oo_waypoint_overlay.no_loading, #oo_entry_overlay.no_loading { background: white; opacity: 0.5; filter: alpha(opacity=50); }";

/* cursor: pointer must be set for iOS to detect click events on the cssText += "\n#oo_waypoint_overlay */
cssText += "\n@media screen and (max-width: 767px) { #oo_waypoint_overlay { cursor: pointer; } }";
cssText += "\n#oo_overlay.no_loading, #oo_invitation_overlay.no_loading, #oo_waypoint_overlay.no_loading, #oo_entry_overlay.no_loading { background: white; opacity: 0.5; filter: alpha(opacity=50); }";

/* IE8 set close prompt icon font size to px instead of em to avoid visual glitch  */
cssText += "\n@media all\0 { #oo_waypoint_prompt #oo_close_prompt, #oo_invitation_prompt #oo_close_prompt, .oo_cc_wrapper .oo_cc_close, #oo_entry_prompt #oo_entry_close_prompt { font-size: 20px; line-height: 20px; top: 8px; } }";
cssText += "\n@media print { #oo_bar, .oo_feedback_float, #oo_tab { display: none; } }";
/* CSS for high-resolution retina devices */
cssText += "\n@media only screen and (-Webkit-min-device-pixel-ratio: 1.5), only screen and (-moz-min-device-pixel-ratio: 1.5), only screen and (-o-min-device-pixel-ratio: 3 / 2), only screen and (min-device-pixel-ratio: 1.5) { n.oo_feedback_float .olUp { background: url(" + float_gif_retina + ") center 10px no-repeat; background-size: 20%; }";
cssText += "\n#oo_tab_1 span.icon { background-image: url(" + tab_1_gif_retina + ") !important; background-size: 100%; } }";

/* Detect if browser is IE */
if (navigator.appName && navigator.appName == 'Microsoft Internet Explorer'){
  css.styleSheet.cssText = cssText;
}else{
  css.innerHTML = cssText;
}
