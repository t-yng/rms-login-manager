import LoginShopManager from '../libs/login-shop-manger';

const createOptionElement = (option) => {
    const optionElement = document.createElement('option');
    optionElement.setAttribute('value', option.value);
    optionElement.textContent = option.text;

    return optionElement;
}

const createSelectElement = (select, options) => {
    const selectElement = document.createElement('select');
    selectElement.setAttribute('name', select.name);
    options.forEach((option) => {
        const optionElement = createOptionElement(option);
        selectElement.appendChild(optionElement);
    });

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

const loginRLogin = async (shopId) => {
    const rLoginIdInput = getRLoginIdInput();
    const rLoginPasswordInput = getRLoginPasswordInput();
    const loginShop = await LoginShopManager.getLoginShop(shopId);
    rLoginIdInput.value = loginShop.rLogin.id;
    rLoginPasswordInput.value = loginShop.rLogin.password;
}

const loginRakutenMember = async (shopId) => {
    const rLoginIdInput = getRakutenMemberLoginIdInput();
    const rLoginPasswordInput = getRakutenMemberLoginPasswordInput();
    const loginShop = await LoginShopManager.getLoginShop(shopId);
    rLoginIdInput.value = loginShop.rakutenMember.id;
    rLoginPasswordInput.value = loginShop.rakutenMember.password;
}

const createLoginShopList = async () => {
    // 店舗一覧のドロップボックスのDOM要素を生成
    const select = {name: 'shop-list'}
    const loginShops = await LoginShopManager.getLoginShops();
    const initOptions = [
        {
            value: '',
            text: 'ログイン店舗を選択してくだい'
        }
    ];
    const loginShopOptions = loginShops.map((shop) => {
        return {
            value: shop.id,
            text: shop.name    
        }
    })
    const options = initOptions.concat(loginShopOptions);

    return createSelectElement(select, options);
}

const main = async () => {
    if(isRLoginLogin()) {
        // 値が選択された時にIDとパスワードに値を入力するコールバックを登録
        const shopListSelect = await createLoginShopList();
        shopListSelect.addEventListener('change', () => {
            loginRLogin(shopListSelect.value);
            chrome.storage.local.set({'loginShopId': shopListSelect.value});
        });
        addLoginShopListSelect(shopListSelect)
    } else {
        const shopListSelect = await createLoginShopList();
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
}

main();