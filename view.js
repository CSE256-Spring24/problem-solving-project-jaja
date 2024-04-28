// ---- Define your dialogs  and panels here ----

// let eff_perm_result = define_new_effective_permissions(id_prefix= "epPanel-eff-perm", add_info_col = true, which_permissions = null)
// $('#adv_effective_effective_list').append(eff_perm_result)
$('#perm_entry_table').attr('filepath', '/C')
$('#perm_entry_table').attr('username', 'administrator')


let new_dialog = define_new_dialog("newDialogue", title="Permission Information")
$('.perm_info').click(function(){
   console.log('clicked!')
   new_dialog.dialog('open')
   let filepath = $('#perm_entry_table').attr('filepath');
   let username = $('#perm_entry_table').attr('username');
   let permission_to_check = $(this).attr('permission_name');
   // Get file object from path_to_file
   let file = path_to_file[filepath];
   // Get user object from all_users
   let user = all_users[username];
   // Call allow_user_action function
   let allowResult = allow_user_action(file, user, permission_to_check, false);
   let explanationText = get_explanation_text(allowResult);
   // Update dialog content with explanation text
   $('#newDialogue').html(explanationText);
   // Open the dialog
   new_dialog.dialog('open');
})

$('#adv_effective_effective_list').attr('filepath', '/C')
$('#adv_effective_effective_list').attr('username', 'administrator')


let eff_perm_new_dialog = define_new_dialog("eff_perm_newDialogue", title="Permission Information")
$('.perm_info').click(function(){
   console.log('clicked!')
   new_dialog.dialog('open')
   let filepath = $('#adv_effective_effective_list').attr('filepath');
   let username = $('#adv_effective_effective_list').attr('username');
   let permission_to_check = $(this).attr('permission_name');
   // Get file object from path_to_file
   let file = path_to_file[filepath];
   // Get user object from all_users
   let user = all_users[username];
   // Call allow_user_action function
   let allowResult = allow_user_action(file, user, permission_to_check, false);
   let explanationText = get_explanation_text(allowResult);
   // Update dialog content with explanation text
   $('#eff_perm_newDialogue').html(explanationText);
   // Open the dialog
   new_dialog.dialog('open');

})


$("#permdialog").dialog({
    minWidth: 675
  });
  
  $("#permdialog").dialog({
    minHeight: 650
  });

  $("#permdialog").dialog({
    position: { my: "center center", at: "center center", of: window }
  });



  var minWidth = $( "#permdialog" ).dialog( "option", "minWidth" );
$( "#permdialog" ).dialog( "option", "minWidth", 675 );

  var minHeight = $( "#permdialog" ).dialog( "option", "minHeight" );
  $( "#permdialog" ).dialog( "option", "minHeight", 650 );

  var position = $( "#permdialog" ).dialog( "option", "position" );
$( ".selector" ).dialog( "option", "position", { my: "center center", at: "center center", of: window } );


// ---- Display file structure ----

// (recursively) makes and returns an html element (wrapped in a jquery object) for a given file object
function make_file_element(file_obj) {
    let file_hash = get_full_path(file_obj)

    if(file_obj.is_folder) {
        let folder_elem = $(`<div class='folder' id="${file_hash}_div">
            <h3 id="${file_hash}_header">
                <span class="oi oi-folder" id="${file_hash}_icon"/> ${file_obj.filename} 
                <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                    <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
                </button>
            </h3>
        </div>`)

        // append children, if any:
        if( file_hash in parent_to_children) {
            let container_elem = $("<div class='folder_contents'></div>")
            folder_elem.append(container_elem)
            for(child_file of parent_to_children[file_hash]) {
                let child_elem = make_file_element(child_file)
                container_elem.append(child_elem)
            }
        }
        return folder_elem
    }
    else {
        return $(`<div class='file'  id="${file_hash}_div">
            <span class="oi oi-file" id="${file_hash}_icon"/> ${file_obj.filename}
            <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
            </button>
        </div>`)
    }
}

for(let root_file of root_files) {
    let file_elem = make_file_element(root_file)
    $( "#filestructure" ).append( file_elem);    
}



// make folder hierarchy into an accordion structure
$('.folder').accordion({
    collapsible: true,
    heightStyle: 'content'
}) // TODO: start collapsed and check whether read permission exists before expanding?


// -- Connect File Structure lock buttons to the permission dialog --

// open permissions dialog when a permission button is clicked
$('.permbutton').click( function( e ) {
    // Set the path and open dialog:
    let path = e.currentTarget.getAttribute('path');
    perm_dialog.attr('filepath', path)
    perm_dialog.dialog('open')
    //open_permissions_dialog(path)

    // Deal with the fact that folders try to collapse/expand when you click on their permissions button:
    e.stopPropagation() // don't propagate button click to element underneath it (e.g. folder accordion)
    // Emit a click for logging purposes:
    emitter.dispatchEvent(new CustomEvent('userEvent', { detail: new ClickEntry(ActionEnum.CLICK, (e.clientX + window.pageXOffset), (e.clientY + window.pageYOffset), e.target.id,new Date().getTime()) }))
});


// ---- Assign unique ids to everything that doesn't have an ID ----
$('#html-loc').find('*').uniqueId() 


document.getElementById("filestructure").style.width = "86%" 
document.getElementById("sidepanel").style.width = "86%" 