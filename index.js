import { animation_duration, eventSource, event_types, getUserAvatar, getUserAvatars, setUserAvatar, user_avatar } from '../../../../script.js';
import { executeSlashCommands } from '../../../slash-commands.js';
import { power_user } from '../../../power-user.js';

let popper = null;
let isOpen = false;

// Options Button

function addOptionsButton() {
    const MoveOptsButton = $('#options_button');
    MoveOptsButton.removeClass().addClass('fa-fw fa-solid fa-cog');
    $('#right-nav-panel').append(MoveOptsButton);
}
// Persona Menu Old Code

function addDCUserButton() {
    const quickPersonaButton = `
    <div id="dcactUserPic">
        <img id="dcactUserImg" src="/img/ai4.png" /></div>`;
    $('#right-nav-panel').append(quickPersonaButton);
    $('#dcactUserPic').on('click', () => {
        toggleQuickPersonaSelector();
    });
}

// Author's Note Button
function addANButton() {
    const MoveANButton = $('#option_toggle_AN');
    MoveANButton.removeClass().addClass('fa-solid fa-pen-to-square');
    $('#right-nav-panel').append(MoveANButton);
}

// CSS Snippets Button
function addCSSSButton() {
  
    const newButton = document.createElement('button');
    newButton.id = 'dc-csss-button';
    newButton.innerHTML = '<i class="fa fa-solid fa-file-code"></i>';
    
    const rightNavPanel = document.querySelector('#right-nav-panel');
    rightNavPanel.appendChild(newButton);
  
    newButton.addEventListener('click', function() {
      const csssButton = document.querySelector('.csss--trigger')
  
      csssButton.click();
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    addCSSSButton();
  });

// Replace Message Bar FA Icons

const iconElement1 = document.querySelector('.fa-solid.fa-magic-wand-sparkles');
iconElement1.classList.remove('fa-solid', 'fa-magic-wand-sparkles');
iconElement1.classList.add('fa-solid', 'fa-circle-plus');

const iconElement2 = document.querySelector('.fa-fw.fa-solid.fa-arrow-right');
iconElement2.classList.remove('fa-fw', 'fa-solid', 'fa-arrow-right');
iconElement2.classList.add('fa-solid', 'fa-arrow-up-right-from-square');

const iconElement3 = document.querySelector('.fa-lg.fa-solid.fa-repeat');
iconElement3.classList.remove('fa-lg', 'fa-solid', 'fa-repeat');
iconElement3.classList.add('fa-solid', 'fa-arrows-rotate');

const iconElement4 = document.querySelector('.fa-solid.fa-paper-plane');
iconElement4.classList.remove('fa-solid', 'fa-paper-plane');
iconElement4.classList.add('fa-solid', 'fa-circle-right');

const iconElement5 = document.querySelector('.fa-lg.fa-solid.fa-note-sticky');
iconElement5.classList.remove('fa-lg', 'fa-solid', 'fa-note-sticky');
iconElement5.classList.add('fa-solid', 'fa-pen-to-square');

// Additional Code STD

function DCHudAvatarConnectionStatus() {
    const dchudavatarconnectionstatusDiv = `
    <div id="DCHudAvatarConnectionStatus">
    </div>`;
    $('#right-nav-panel').append(dchudavatarconnectionstatusDiv);
} 

function addHudActiveUsername() {
    const userAvatar = 'userAvatar';
    const imgTitle = power_user.personas[user_avatar] || user_avatar;
    const userName = imgTitle;

    const hudactiveusernameDiv = `
    <div id="HudActiveUsername">
        <div id="UserName">${userName}</div>
    </div>`;

    $('#right-nav-panel').append(hudactiveusernameDiv);
}

function addDCHudBackground() {
    const dchudbackgroundDiv = `
    <div id="DCHudBackground" style="width: 240px; height: 53px;">
      <div id="DCHudOnlineUserStatus" class="HudOnline">
          Online
      </div>
      <div id="DCHudOfflineUserStatus" class="HudOffline">
          Offline
      </div>
    </div>`;
    $('#right-nav-panel').append(dchudbackgroundDiv);
}

$(document).ready(function() {
    addCSSSButton();
    addANButton();
    addOptionsButton();
    DCHudAvatarConnectionStatus();
    addHudActiveUsername();
    addDCHudBackground();
  });

  // Additional Code 

async function toggleQuickPersonaSelector() {
    if (isOpen) {
        closeQuickPersonaSelector();
        return;
    }
    await openQuickPersonaSelector();
}

async function openQuickPersonaSelector() {
    isOpen = true;
    const userAvatars = await getUserAvatars(false);
    const quickPersonaList = $('<div id="dcuserpanelPersonaMenu"><ul class="list-group"></ul></div>');
    for (const userAvatar of userAvatars) {
        const imgUrl = `${getUserAvatar(userAvatar)}?t=${Date.now()}`;
        const imgTitle = power_user.personas[userAvatar] || userAvatar;
        const isSelected = userAvatar === user_avatar;
        const isDefault = userAvatar === power_user.default_persona;
        const listItem = $('<li class="list-group-item"><img class="dcpanelPersonaMenuImg"/></li>');
        listItem.find('img').attr('src', imgUrl).attr('title', imgTitle).toggleClass('selected', isSelected).toggleClass('default', isDefault);
        listItem.on('click', () => {
            closeQuickPersonaSelector();
            setUserAvatar(userAvatar);
            changeQuickPersona();
        });
        quickPersonaList.find('ul').append(listItem);
    }
    quickPersonaList.hide();
    $(document.body).append(quickPersonaList);
    $('#dcuserpanelPersonaMenu').fadeIn(animation_duration);
    // @ts-ignore
    popper = Popper.createPopper(document.getElementById('dcactUserPic'), document.getElementById('dcuserpanelPersonaMenu'), {
        placement: 'top-start',
    });
    popper.update();
}

function closeQuickPersonaSelector() {
    isOpen = false;
    $('#dcuserpanelPersonaMenu').fadeOut(animation_duration, () => {
        $('#dcuserpanelPersonaMenu').remove();
    });
    popper.destroy();
}

function changeQuickPersona() {
    setTimeout(() => {
        const imgUrl = `${getUserAvatar(user_avatar)}?t=${Date.now()}`;
        const imgTitle = power_user.personas[user_avatar] || user_avatar;
        $('#dcactUserImg').attr('src', imgUrl).attr('title', imgTitle);
        $('#UserName').text(imgTitle); // Moddified to update the user name in the HudActiveUsername div
    }, 100);
}

jQuery(() => {
    addDCUserButton();
    eventSource.on(event_types.CHAT_CHANGED, changeQuickPersona);
    eventSource.on(event_types.SETTINGS_UPDATED, changeQuickPersona);
    $(document.body).on('click', (e) => {
        if (isOpen && !e.target.closest('#dcuserpanelPersonaMenu') && !e.target.closest('#dcactUserPic')) {
            closeQuickPersonaSelector();
        }
    });
    changeQuickPersona();
});
