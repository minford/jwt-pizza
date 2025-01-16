# Learning notes

## JWT Pizza code study and debugging

As part of `Deliverable ⓵ Development deployment: JWT Pizza`, start up the application and debug through the code until you understand how it works. During the learning process fill out the following required pieces of information in order to demonstrate that you have successfully completed the deliverable.

| User activity                                       | Frontend component | Backend endpoints | Database SQL |
| --------------------------------------------------- | ------------------ | ----------------- | ------------ |
| View home page                                      |    home.jsx                |          none         |          none    |
| Register new user<br/>(t@jwt.com, pw: test)         |           register.jsx         |             [POST] /api/auth      |    INSERT INTO user (name, email, password) VALUES (?, ?, ?)INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?)          |
| Login new user<br/>(t@jwt.com, pw: test)            |          login.tsx          |      [PUT] /api/auth             |  INSERT INTO auth (token, userId) VALUES (?, ?)`, [token, userId]            |
| Order pizza                                         |   menu.tsx                 |                   |        SELECT * FROM menu      |
| Verify pizza                                        |    delivery.tsx                |                   |       SELECT id, menuId, description, price FROM orderItem WHERE orderId=?`, [order.id]       |
| View profile page                                   |  dinerDashboard.tsx                  |                   |       SELECT * FROM userRole WHERE userId=?      |
| View franchise<br/>(as diner)                       |      franchiseDashboard.tsx              |                   |       SELECT id, name FROM franchise   SELECT id, name FROM store WHERE franchiseId=?`, [franchise.id]     |
| Logout                                              |   logout.tsx                 |                   |       DELETE FROM auth WHERE token=?`, [token]       |
| View About page                                     |     about.tsx               |           none        |        none      |
| View History page                                   |     history.tsx               |       none            |        none      |
| Login as franchisee<br/>(f@jwt.com, pw: franchisee) |     login.tsx               |                   |         INSERT INTO auth (token, userId) VALUES (?, ?)`, [token, userId]     |
| View franchise<br/>(as franchisee)                  |    franchiseDashboard.tsx                |                  |              |
| Create a store                                      |      createStore.tsx              |                   |              |
| Close a store                                       |     closeStore.tsx               |                   |              |
| Login as admin<br/>(a@jwt.com, pw: admin)           |             login.tsx       |                   |         INSERT INTO auth (token, userId) VALUES (?, ?)`, [token, userId]     |
| View Admin page                                     |     adminDashboard.tsx                 |                 |         none     | none
| Create a franchise for t@jwt.com                    |    createFranchise.tsx                |                   |        SELECT id, name FROM user WHERE email=?    INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?)    |
| Close the franchise for t@jwt.com                   |     closeFranchise.tsx               |                   |              |
