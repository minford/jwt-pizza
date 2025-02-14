import { test, expect } from 'playwright-test-coverage';

test('home page', async ({ page }) => {
    await page.goto('/');

    expect(await page.title()).toBe('JWT Pizza');
});

test('purchase with login', async ({ page }) => {
    await page.route('*/**/api/order/menu', async (route) => {
        const menuRes = [
            { id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'A garden of delight' },
            { id: 2, title: 'Pepperoni', image: 'pizza2.png', price: 0.0042, description: 'Spicy treat' },
        ];
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: menuRes });
    });

    await page.route('*/**/api/franchise', async (route) => {
        const franchiseRes = [
            {
                id: 2,
                name: 'LotaPizza',
                stores: [
                    { id: 4, name: 'Lehi' },
                    { id: 5, name: 'Springville' },
                    { id: 6, name: 'American Fork' },
                ],
            },
            { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
            { id: 4, name: 'topSpot', stores: [] },
        ];
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: franchiseRes });
    });

    await page.route('*/**/api/auth', async (route) => {
        const loginReq = { email: 'd@jwt.com', password: 'a' };
        const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
        expect(route.request().method()).toBe('PUT');
        expect(route.request().postDataJSON()).toMatchObject(loginReq);
        await route.fulfill({ json: loginRes });
    });

    await page.route('*/**/api/order', async (route) => {
        const orderReq = {
            items: [
                { menuId: 1, description: 'Veggie', price: 0.0038 },
                { menuId: 2, description: 'Pepperoni', price: 0.0042 },
            ],
            storeId: '4',
            franchiseId: 2,
        };
        const orderRes = {
            order: {
                items: [
                    { menuId: 1, description: 'Veggie', price: 0.0038 },
                    { menuId: 2, description: 'Pepperoni', price: 0.0042 },
                ],
                storeId: '4',
                franchiseId: 2,
                id: 23,
            },
            jwt: 'eyJpYXQ',
        };
        expect(route.request().method()).toBe('POST');
        expect(route.request().postDataJSON()).toMatchObject(orderReq);
        await route.fulfill({ json: orderRes });
    });

    await page.goto('/');

    // Go to order page
    await page.getByRole('button', { name: 'Order now' }).click();

    // Create order
    await expect(page.locator('h2')).toContainText('Awesome is a click away');
    await page.getByRole('combobox').selectOption('4');
    await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
    await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
    await expect(page.locator('form')).toContainText('Selected pizzas: 2');
    await page.getByRole('button', { name: 'Checkout' }).click();

    // Login
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('d@jwt.com');
    await page.getByPlaceholder('Email address').press('Tab');
    await page.getByPlaceholder('Password').fill('a');
    await page.getByRole('button', { name: 'Login' }).click();

    // Pay
    await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
    await expect(page.locator('tbody')).toContainText('Veggie');
    await expect(page.locator('tbody')).toContainText('Pepperoni');
    await expect(page.locator('tfoot')).toContainText('0.008 ₿');
    await page.getByRole('button', { name: 'Pay now' }).click();

    // Check balance
    await expect(page.getByText('0.008')).toBeVisible();
});

test('register', async ({ page }) => {

    await page.route('*/**/api/auth', async (route) => {
        const regReq = { email: 'new@email.com', password: 'pass' };
        const regRes = { user: { id: 3, name: 'New User', email: 'new@email.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
        expect(route.request().method()).toBe('POST');
        expect(route.request().postDataJSON()).toMatchObject(regReq);
        await route.fulfill({ json: regRes });
    });

    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByPlaceholder('Full name').click();
    await page.getByPlaceholder('Full name').fill('New User');
    await page.getByPlaceholder('Email address').fill('new@email.com');
    await page.getByPlaceholder('Password').fill('pass');
    await page.getByRole('button', { name: 'Register' }).click();
});

test('logout', async ({ page }) => {

    await page.route('*/**/api/auth', async (route) => {
        const loginRes = { user: { id: 3, name: 'admin', email: 'a@jwt.com', roles: [{ role: 'admin' }] }, token: 'abcdef' };
        await route.fulfill({ json: loginRes });
    });

    await page.goto('http://localhost:5173/login');

    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('a@jwt.com');
    await page.getByPlaceholder('Password').fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page).toHaveURL('/');
});

test('about page', async ({ page }) => {

    await page.goto('http://localhost:5173/about');
    await expect(page.getByText('The secret sauce', { exact: true })).toBeVisible();
});

test('diner dashboard', async ({ page }) => {

    await page.route('*/**/api/auth', async (route) => {
        const loginRes = { user: { id: 3, name: 'admin', email: 'a@jwt.com', roles: [{ role: 'admin' }] }, token: 'abcdef' };
        await route.fulfill({ json: loginRes });
    });

    await page.goto('http://localhost:5173/login');

    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('a@jwt.com');
    await page.getByPlaceholder('Password').fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.goto('http://localhost:5173/diner-dashboard');
    await expect(page.getByText('Your pizza kitchen', { exact: true })).toBeVisible();

});

test('docs page', async ({ page }) => {
    await page.goto('http://localhost:5173/docs');
    await expect(page.getByText('JWT Pizza API', { exact: true })).toBeVisible();

});

test('franchise dashboard', async ({ page }) => {
    await page.goto('http://localhost:5173/franchise-dashboard');
    await expect(page.getByText('So you want a piece of the pie?', { exact: true })).toBeVisible();

});

test('history page', async ({ page }) => {
    await page.goto('http://localhost:5173/history');
    await expect(page.getByText('Mama Rucci, my my', { exact: true })).toBeVisible();

});

test('admin dashboard without logging in', async ({ page }) => {
    await page.goto('http://localhost:5173/admin-dashboard');
    await expect(page.getByText('Oops', { exact: true })).toBeVisible();

});

test('create franchise', async ({ page }) => {

    await page.route('*/**/api/auth', async (route) => {
        const loginRes = { user: { id: 3, name: 'person', email: 'a@jwt.com', roles: [{ role: 'admin' }] }, token: 'abcdef' };
        await route.fulfill({ json: loginRes });
    });

    await page.goto('http://localhost:5173/login');

    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('a@jwt.com');
    await page.getByPlaceholder('Password').fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.getByRole('link', { name: 'Admin' }).click();

    await page.getByRole('button', { name: 'Add Franchise' }).click();
    await page.getByPlaceholder('franchise name').click();
    await page.getByPlaceholder('franchise name').fill('Pizza Shop');
    await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
    await page.getByPlaceholder('franchisee admin email').fill('a@jwt.com');
    await page.getByRole('button', { name: 'Create' }).click();
    // await page.getByRole('row', { name: 'Pizza Shop person Close' }).getByRole('button').click();
    // await page.getByRole('button', { name: 'Close' }).click();
});

test('create store', async ({ page }) => {
    await page.route('*/**/api/auth', async (route) => {
        const loginRes = { user: { id: 3, name: 'franchisee', email: 'f@jwt.com', roles: [{ role: 'franchisee' }] }, token: 'abcdef' };
        await route.fulfill({ json: loginRes });
    });

    await page.goto('http://localhost:5173/login');

    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill('f@jwt.com');
    await page.getByPlaceholder('Password').fill('franchisee');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.getByRole('link', { name: 'Franchise' }).click();
  });
  