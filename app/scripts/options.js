import md5 from 'blueimp-md5';

const setLoginShopForm = (loginShop) => {
    document.getElementById('shop-name').value = loginShop.shopName;
    document.getElementById('r-login-id').value = loginShop.rLogin.id;
    document.getElementById('r-login-password').value = loginShop.rLogin.password;
    document.getElementById('rakuten-login-id').value = loginShop.rakutenMember.id;
    document.getElementById('rakuten-login-password').value = loginShop.rakutenMember.password;
}

const createNewLoginShop = () => {
    return {
        shopName: '',
        rLogin: {
            id: '',
            password: ''
        },
        rakutenMember: {
            id: '',
            password: ''
        }
    }
}

const onSelectLoginShop = (loginShopId) => {
    chrome.storage.sync.get(['loginShops'], (result) => {
        let loginShop = result.loginShops.find((shop) => shop.shopId === loginShopId);
        loginShop = (loginShop !== undefined) ? loginShop : createNewLoginShop();
        setLoginShopForm(loginShop);
    });
}

const updateLoginShopsSelect = (loginShops) => {
    const select = document.querySelector('select[name="login-shop-list"]');
    loginShops.forEach((shop) => {
        let option = document.createElement('option');
        option.setAttribute('value', shop.shopId);
        option.textContent = shop.shopName;
        select.appendChild(option);
    });
    select.addEventListener('change', () => {
        const selectedLoginShopId = select.value;
        onSelectLoginShop(selectedLoginShopId);
    })
}

const getSelectedLoginShopId = () => {
    const select = document.querySelector('select[name="login-shop-list"]');
    return (select.value !== '') ? select.value : null;
}

chrome.storage.sync.get(['loginShops'], (result) => {
    const loginShops = (result.loginShops) ? result.loginShops : [];
    updateLoginShopsSelect(loginShops);
})

document.getElementById('save-shop-login')
.addEventListener('click', () => {
    const shopName = document.getElementById('shop-name').value;
    const shopId   = md5(shopName);
    const rLoginId = document.getElementById('r-login-id').value;
    const rLoginPassword = document.getElementById('r-login-password').value;
    const rakutenId = document.getElementById('rakuten-login-id').value;
    const rakutenPassword = document.getElementById('rakuten-login-password').value;

    const loginInfo = {
        shopName,
        shopId,
        rLogin: {
            id: rLoginId,
            password: rLoginPassword
        },
        rakutenMember: {
            id: rakutenId,
            password: rakutenPassword
        }
    }

    chrome.storage.sync.get(['loginShops'], (result) => {
        let loginShops = (result.loginShops) ? result.loginShops : [];
        const selectedLoginShopId = getSelectedLoginShopId();

        if(selectedLoginShopId === null) {
            loginShops.push(loginInfo);
        } else {
            const index = loginShops.findIndex((shop) => shop.shopId === selectedLoginShopId);
            loginShops[index] = loginInfo;
        }

        chrome.storage.sync.set({loginShops}, () => alert('ログイン情報を保存しました。'));
    });
})