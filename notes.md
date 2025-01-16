# Learning notes

## JWT Pizza code study and debugging

As part of `Deliverable ⓵ Development deployment: JWT Pizza`, start up the application and debug through the code until you understand how it works. During the learning process fill out the following required pieces of information in order to demonstrate that you have successfully completed the deliverable.

| User activity                                       | Frontend component | Backend endpoints | Database SQL |
| --------------------------------------------------- | ------------------ | ----------------- | ------------ |
| View home page                                      |    home.jsx                |          none         |          none    |
| Register new user<br/>(t@jwt.com, pw: test)         |           register.jsx         |             [POST] /api/auth      |    INSERT INTO user (name, email, password) VALUES (?, ?, ?)INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?)          |
| Login new user<br/>(t@jwt.com, pw: test)            |          login.tsx          |      [PUT] /api/auth             |  INSERT INTO auth (token, userId) VALUES (?, ?)`, [token, userId]            |
| Order pizza                                         |   menu.tsx                 |          [POST] /api/order         |        SELECT * FROM menu      |
| Verify pizza                                        |    delivery.tsx                |     none              |       SELECT id, menuId, description, price FROM orderItem WHERE orderId=?`, [order.id]       |
| View profile page                                   |  dinerDashboard.tsx                  |         none          |       SELECT * FROM userRole WHERE userId=?      |
| View franchise<br/>(as diner)                       |      franchiseDashboard.tsx              |       [GET] /api/franchise            |       SELECT id, name FROM franchise   SELECT id, name FROM store WHERE franchiseId=?`, [franchise.id]     |
| Logout                                              |   logout.tsx                 |      [DELETE] /api/auth             |       DELETE FROM auth WHERE token=?`, [token]       |
| View About page                                     |     about.tsx               |           none        |        none      |
| View History page                                   |     history.tsx               |       none            |        none      |
| Login as franchisee<br/>(f@jwt.com, pw: franchisee) |     login.tsx               |     [PUT] /api/auth               |         INSERT INTO auth (token, userId) VALUES (?, ?)`, [token, userId]     |
| View franchise<br/>(as franchisee)                  |    franchiseDashboard.tsx                |      [GET] /api/franchise/:userId            |        SELECT u.id, u.name, u.email FROM userRole AS ur JOIN user AS u ON u.id=ur.userId WHERE ur.objectId=? AND ur.role='franchisee'      |
| Create a store                                      |      createStore.tsx              |      [POST] /api/franchise            |      INSERT INTO store (franchiseId, name) VALUES (?, ?)        |
| Close a store                                       |     closeStore.tsx               |          [DELETE]  /api/franchise/:franchiseId         |              |
| Login as admin<br/>(a@jwt.com, pw: admin)           |             login.tsx       |        [PUT] /api/auth            |         INSERT INTO auth (token, userId) VALUES (?, ?)`, [token, userId]     |
| View Admin page                                     |     adminDashboard.tsx                 |         none        |         none     |
| Create a franchise for t@jwt.com                    |    createFranchise.tsx                |        [POST] /api/franchise/:franchiseId/store            |        SELECT id, name FROM user WHERE email=?    INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?)    |
| Close the franchise for t@jwt.com                   |     closeFranchise.tsx               |        [DELETE]  /api/franchise/:franchiseId/store/:storeId          |        DELETE FROM store WHERE franchiseId=? AND id=?      |
