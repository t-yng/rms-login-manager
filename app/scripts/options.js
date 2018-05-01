import md5 from 'blueimp-md5';
import LoginShopManager from '../libs/login-shop-manger';

const setLoginShopForm = (loginShop) => {
    document.getElementById('shop-name').value = loginShop.name;
    document.getElementById('r-login-id').value = loginShop.rLogin.id;
    document.getElementById('r-login-password').value = loginShop.rLogin.password;
    document.getElementById('rakuten-login-id').value = loginShop.rakutenMember.id;
    document.getElementById('rakuten-login-password').value = loginShop.rakutenMember.password;
}

const onSelectLoginShop = async (loginShopId) => {
    const loginShop = await LoginShopManager.getLoginShop(loginShopId);
    setLoginShopForm(loginShop);
}

const updateLoginShopsSelect = (loginShops) => {
    const select = document.querySelector('select[name="login-shop-list"]');
    loginShops.forEach((shop) => {
        let option = document.createElement('option');
        option.setAttribute('value', shop.id);
        option.textContent = shop.name;
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

const main = async () => {
    const loginShops = await LoginShopManager.getLoginShops();
    updateLoginShopsSelect(loginShops);
}

const createLoginShopFromForm = () => {
    const shopName = document.getElementById('shop-name').value;
    const shopId   = md5(shopName);
    const rLoginId = document.getElementById('r-login-id').value;
    const rLoginPassword = document.getElementById('r-login-password').value;
    const rakutenId = document.getElementById('rakuten-login-id').value;
    const rakutenPassword = document.getElementById('rakuten-login-password').value;

    return {
        id: shopId,
        name: shopName,
        rLogin: {
            id: rLoginId,
            password: rLoginPassword
        },
        rakutenMember: {
            id: rakutenId,
            password: rakutenPassword
        }
    }
}

document.getElementById('save-shop-login')
.addEventListener('click', async () => {
    const loginShop = createLoginShopFromForm();
    const selectedLoginShopId = getSelectedLoginShopId();

    if(selectedLoginShopId === null) {
        await LoginShopManager.insertLoginsShop(loginShop);
    } else {
        await LoginShopManager.updateLoginShop(selectedLoginShopId, loginShop);
    }

    alert('ログイン情報を保存しました。');
})

main();