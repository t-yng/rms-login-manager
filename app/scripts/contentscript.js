// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'

class ShopLoginManager {
    constructor() {
        this.shopList = [
            {
                id: '1',
                rLogin: {
                    id:'testpartner921',
                    password: 'njadm0013'
                },
                rakutenMember: {
                    id: 'partner_259',
                    password: '91BTHU7F'
                }
            }
        ]    
    }

    getRLogin(shopId) {
        const shop = this.shopList.find((shop) => shop.id === shopId);
        return (shop !== undefined) ? shop.rLogin : null;
    }

    getRakutenMemberLogin(shopId) {
        const shop = this.shopList.find((shop) => shop.id === shopId);
        return (shop !== undefined) ? shop.rakutenMember : null;        
    }
}

const createOptionElement = (option) => {
    const optionElement = document.createElement('option')
    optionElement.setAttribute('value', option.value);
    optionElement.textContent = option.text

    return optionElement;
}

const createSelectElement = (select, options) => {
    const selectElement = document.createElement('select');
    selectElement.setAttribute('name', select.name);
    options.forEach((option) => {
        const optionElement = createOptionElement(option);
        selectElement.appendChild(optionElement);
    })

    return selectElement;
}

const getLoginMainElement = () => {
    return document.querySelector('[class*="rf-form-login--step-1"]');    
}

const getRLoginIdInput = () => {
    return document.getElementById('rlogin-username-ja');
}

const getRLoginPasswordInput = () => {
    return document.getElementById('rlogin-password-ja')
}

const getRakutenMemberLoginIdInput = () => {
    return document.getElementById('rlogin-username-2-ja');
}

const getRakutenMemberLoginPasswordInput = () => {
    return document.getElementById('rlogin-password-2-ja');
}

const isRLoginLogin = () => {
    const loginStep1Success = document.querySelector('.rf-form-login--step-1--success');
    return loginStep1Success === null;
}

const addLoginShopListSelect = (shopListSelect) => {
    // ログインステップ1の上に店舗一覧を追加
    const loginStep1 = getLoginMainElement();
    if(loginStep1 === null) return;
    loginStep1.parentNode.insertBefore(shopListSelect, loginStep1);
}

const loginRLogin = (shopId) => {
    const rLoginIdInput = getRLoginIdInput();
    const rLoginPasswordInput = getRLoginPasswordInput();
    const manager = new ShopLoginManager();
    const rLogin  = manager.getRLogin(shopId);
    rLoginIdInput.value = rLogin.id;
    rLoginPasswordInput.value = rLogin.password;
}

const loginRakutenMember = (shopId) => {
    const rLoginIdInput = getRakutenMemberLoginIdInput();
    const rLoginPasswordInput = getRakutenMemberLoginPasswordInput();
    const manager = new ShopLoginManager();
    const login  = manager.getRakutenMemberLogin(shopId);
    rLoginIdInput.value = login.id;
    rLoginPasswordInput.value = login.password;
}

const createLoginShopList = () => {
    // 店舗一覧のドロップボックスのDOM要素を生成
    const select = {name: 'shop-list'}
    const options = [
        {
            value: '',
            text: 'ログイン店舗を選択してくだい'
        },
        {
            value: 1,
            text: 'ぽんぽん'
        },
        {
            value: 2,
            text: 'ぽんぽん2'
        }
    ]
    return createSelectElement(select, options);
}

if(isRLoginLogin()) {
    // 値が選択された時にIDとパスワードに値を入力するコールバックを登録
    const shopListSelect = createLoginShopList();
    shopListSelect.addEventListener('change', () => {
        loginRLogin(shopListSelect.value);
        chrome.storage.local.set({'loginShopId': shopListSelect.value});
    });
    addLoginShopListSelect(shopListSelect)
} else {
    const shopListSelect = createLoginShopList();
    chrome.storage.local.get(['loginShopId'], (result) => {
        const loginShopId = result.loginShopId;
        const selectedIndex = [...Array(shopListSelect.options.length)].findIndex((_, index) => {
            return shopListSelect.options[index].value === loginShopId;
        })
        shopListSelect.selectedIndex = selectedIndex;
        loginRakutenMember(loginShopId);
    })
    addLoginShopListSelect(shopListSelect);
}
