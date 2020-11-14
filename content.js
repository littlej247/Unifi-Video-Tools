// content.js
(function(){
    console.log("%cUi Video Tools Extension", "background: #000; color: #00a0df; font-size: 24px; font-family: Monospace; padding : 5px 234px 5px 10px;");
    addFullScreenCss();
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
        fullTabIcon(element, header);
    });

    function fullTabIcon(node, header){
        //debugger;
        let rightDiv = header.querySelector('div.right');

        let icon = document.createElement('span');
        icon.classList.add('button__icon', 'ubnt-icon--arrows-updown-leftright');
        let label = document.createElement('span');
        label.innerText = 'Expand';
        let button = document.createElement('button');
        button.classList.add('appTextButton');
        button.appendChild(icon);
        button.appendChild(label);
        rightDiv.appendChild(button);

        button.onclick=(e)=>{
            console.log('you clicked me... how dare you!!..');

            var b = document.querySelector('body');
            var v = document.querySelector('.camera-grid');
            v.classList.add('myTestClass');
            var parent = v.parentNode;

            b.appendChild(v);
            /*
            v.style.marginTop = 'unset'
            v.style.marginLeft = 'unset'
            v.style.left = 'unset'
            v.style.width = '100%'
            v.style.height = '100%'
            v.style.zIndex="10000";
            */

            //Add escape button
            var e = document.createElement('div');
            e.classList.add('appMainButton', 'appGlobalHeader__content--right');
            e.style.zIndex="10000";

            e.innerText = 'Exit';
            b.appendChild(e);
            e.onclick = ()=>{
                console.log('exit now.');
                parent.appendChild(v);
                v.classList.remove('myTestClass');
                e.remove();
            }




        }

        function exitFullScreen(videoElement, originalParent, exitButton){
            //Move the videoElement back,

            //delete exitButton


        }
    }

    function addFullScreenCss(){
        var sheet = window.document.styleSheets[0];
        sheet.insertRule(`.myTestClass {
        z-index: 10000!important;
        left: unset!important;
        margin-left: unset!important;
        width: 100%!important;
        height: 100%!important;
        top: 0px!important;
        margin-top: unset!important;
        opacity: 1!important;
     }`, sheet.cssRules.length);
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
