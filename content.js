// content.js
(function(){
    console.log("%cUi Video Tools Extension", "background: #000; color: #00a0df; font-size: 24px; font-family: Monospace; padding : 5px 234px 5px 10px;");
    
    addCss();
    function getNewEmberByClassName(className, cb){

        function foundIt (element, node, mutation){
            console.log('is this the element you\'r looking for?', element);
            console.log('is this the node child you\'re looking for?',node);
            console.log('mutation record: ',mutation);
            cb(element);
        }
        // Options for the observer (which mutations to observe)
        // desc of config options: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe
        const config = {attributes: false, childList: true, subtree: true};
        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(
          // Callback function to execute when mutations are observed
          (mutationsList, document)=>{
            // Use traditional 'for loops' for IE 11
            for(const mutation of mutationsList) {
                //console.log('mutation: ', mutation);
                for(const node of mutation.addedNodes) {
                    //console.log('added node:', node);
                    if (node.classList && node.classList.contains('ember-view') ){
                        //console.log("this is the mutation that made me do it..", mutation);

                        //Check if the new node CONTAINS the desired element.
                        let potential_live_view = node.querySelector('.'+className);
                        if (potential_live_view ) {
                            foundIt(potential_live_view, node, mutation);
                            return;
                        }
                        //Check if the new node IS the desired element.
                        if (node.classList.contains(className)){
                            foundIt(node, node, mutation);
                            return;
                        }
                    }
                }
            }
          }
        );
        // Start observing the target node for configured mutations
        observer.observe(document, config);
    }

    // Starting point for new live-view page.
    getNewEmberByClassName('mainSubView--liveViews', (element)=>{
        console.log("Running content script");
        let header = element.querySelector('header.mainSubView__header');
        addFullPageIcon_live(element, header);
    });

    // Starting point for new watchRecordingPanel.
    getNewEmberByClassName('watchRecordingPanel', (element)=>{
        console.log("Running watchRecordingPanel");
        let controls = element.querySelector('div.video-player--controls');
        addFullPageIcon_recording(element, controls);
    });


    /* Add expand button to the recording player */
    function addFullPageIcon_recording(node, bar){

        let videoContainer = node.querySelector("div.recording-player")
        let button = fullPageButton(videoContainer, {showExit:false, 
            onFullPage: ()=>{
                videoContainer.querySelector('.video-player--controls').style.transform = 'unset';
            },
            onExit:()=>{
                videoContainer.querySelector('.video-player--controls').style.transform = '';
        }});

        button.classList.add('button__icon', 'ubnt-icon--arrows-updown-leftright', 'tools-player-button');
        button.style.margin ="5px 10px";
        bar.appendChild(button);
    }
    
    
    /* Add expand button to the live-view header */
    function addFullPageIcon_live(node, header){

        let rightDiv = header.querySelector('div.right');
        let icon = document.createElement('span');
        let label = document.createElement('span');
        let videoContainer = node.querySelector('.camera-grid');
        let button = fullPageButton(videoContainer);

        icon.classList.add('button__icon', 'ubnt-icon--arrows-updown-leftright');
        label.innerText = 'Fullpage';
        button.classList.add('appTextButton');
        button.appendChild(icon);
        button.appendChild(label);
        rightDiv.appendChild(button);
    }


    function fullPageButton(videoContainer, options={}){

        //Set default options
        options.fullPage=false;
        if (options.showExit === undefined) options.showExit = true;
        
        var originalParent = videoContainer.parentNode;
        var exitButton;

        //Create Button
        let button = document.createElement('span');
        button.onclick = ()=>{
            if(options.fullPage === false ){
                goFullPage();
            } else {
                restore();
            }
        }

        function goFullPage(){
            options.fullPage = true;

            var b = document.querySelector('body');
            b.appendChild(videoContainer);
            videoContainer.classList.add('tools-videoOverlay');

            //Add escape button
            if (options.showExit === true){
                exitButton = document.createElement('div');
                exitButton.classList.add('icon', 'ubnt-icon--x', 'appMainButton', 'appGlobalHeader__content--right');
                exitButton.style.zIndex="10000";
                exitButton.style.top="0px";
                exitButton.onclick = restore;
                b.appendChild(exitButton);   
            }

            if (options.onFullPage) options.onFullPage();
        }

        function restore(){
            options.fullPage = false;

            originalParent.appendChild(videoContainer);
            videoContainer.classList.remove('tools-videoOverlay');

            if (exitButton) exitButton.remove();
            if (options.onExit) options.onExit(parent, videoContainer);
        }

        return button
    }
    
    function addCss(){
        var sheet = document.styleSheets[document.styleSheets.length-1];
        /* expanded window sizing */
        //z-index: 10000 is just enough to cover the username and icon.
        sheet.insertRule(`
        .tools-videoOverlay {
            z-index: 10000!important;
            left: unset!important;
            margin-left: unset!important;
            width: 100%!important;
            height: 100%!important;
            top: 0px!important;
            margin-top: unset!important;
            opacity: 1!important;
            position: absolute;
        }`);
        
        /* Increase the clickable area of the play/pause button */
        sheet.insertRule(`
        .video-player-control--play-pause,
        .tools-player-button{
            height: 100%;
            width: 30px;
            margin: unset!important;
            padding: 5px 8px;
        }`
        , sheet.cssRules.length);
    }

})();



// content.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      var firstHref = $("a[href^='http']").eq(0).attr("href");

      console.log(firstHref);
    }
  }
);
