function toggleSettings() {
    document.querySelector('.user_block').classList.add('hidden');
    document.querySelector('.settings_block').classList.toggle('hidden');

    if (isNoteSynced) {
        document.getElementById('settings-warning_save').style.display = 'none';
        document.querySelector('#settings-fontSize').classList.remove('top_border');
        document.querySelector('#settings-interface').disabled = false;
    } else {
        document.getElementById('settings-warning_save').style.display = 'block';
        document.querySelector('#settings-fontSize').classList.add('top_border');
        document.querySelector('#settings-interface').disabled = true;
    }
}

const isMultipleValues = 0;
const isNumber = 1;
const isPercentage = 2;

const settings = [
    {
        name: 'interface',
        type: isMultipleValues,
        values: ['По умолчанию', 'Компактный'],
        default: 0
    },
    {
        name: 'fontSize',
        type: isPercentage,
        minValue: 50,
        maxValue: 200,
        default: 100
    },
    {
        name: 'darkTheme',
        type: isMultipleValues,
        values: ['Автоматическая', 'Всегда светлая', 'Всегда тёмная'],
        default: 0
    },
    {
        name: 'listSyncFrequency',
        type: isMultipleValues,
        values: ['5', '15', '30', '60', '120'],
        default: 2
    },
    {
        name: 'autoSave',
        type: isMultipleValues,
        values: ['Выключено', '5', '15', '30', '60'],
        default: 0
    },
];

function initializeSettings() {
    for (let i=0; i<settings.length; i++) {
        let name = settings[i].name;
        
        if (localStorage.getItem(`settings-${name}`) == undefined) {

            let defaultValue = settings[i].default;
            switch (settings[i].type) {
                case isMultipleValues:
                    let values = settings[i].values;
                    localStorage.setItem(`settings-${name}`, values[defaultValue]);
                    break;
                default:
                    localStorage.setItem(`settings-${name}`, defaultValue);
            }

        }
        if (settings[i].type == isMultipleValues) {
            document.querySelector(`#settings-${name}`).querySelector('.value').innerText = localStorage.getItem(`settings-${name}`);
        } else {
            document.querySelector(`#settings-${name}`).querySelector('.value').value = localStorage.getItem(`settings-${name}`);
        }
    }
}

function getSettingInfo(name) {
    return settings.find(setting => setting.name === name);
}

function changeSetting(name, value) {
    let settingInfo = getSettingInfo(name);
    let currentValue = localStorage.getItem(`settings-${name}`);

    switch (settingInfo.type) {
        case isMultipleValues:
            let values = settingInfo.values;
            let nextValue = value;
            if (value == undefined) {
                let currentIndex = values.indexOf(currentValue);
                if (currentIndex + 1 >= values.length) {
                    currentIndex = -1;
                }
                nextValue = values[currentIndex + 1];
            }
            
            localStorage.setItem(`settings-${name}`, nextValue);
            document.querySelector(`#settings-${name}`).querySelector('.value').innerText = nextValue;
            break;
        default:
            localStorage.setItem(`settings-${name}`, value);
            document.querySelector(`#settings-${name}`).querySelector('.value').value = value;
    }
}

function getSetting(name) {
    return localStorage.getItem(`settings-${name}`);
}