const express = require('express');
const router = express.Router();
const mysql = require('../connection');
const { checkToken } = require('../middleware/verifyToken');
const transporter = require('../sender');


router.post('/:id', checkToken, (req, res) => {
    let query = 'INSERT INTO `emails` (`email`, `user_id`, `trans_id`, `content`) VALUES (?, ?, ?, ?)';
    let queryUpdate = 'UPDATE `stats` SET `total_requests` = `total_requests` + 1 WHERE user_id = ?';
   

    // let { content} = req.body;

    mysql.query(query, [req.user.email, req.user.id, req.params.id, req.body.content], (error, result) => {
        if(error) throw error;
            
        mysql.query(queryUpdate, [req.user.id], (error, response) => {
            if(error) throw error;
            
            let query2 = 'SELECT u.username AS userName, e.email AS userEmail, t.name AS transName, t.email AS transEmail, t.phone AS transPhone, fromlang.name AS fromLang, tolang.name AS toLang, e.content AS content, e.date AS date FROM emails AS e INNER JOIN users AS u ON u.id = e.user_id INNER JOIN translators AS t ON t.id = e.trans_id INNER JOIN languages AS tolang ON tolang.id = t.lang_to LEFT JOIN languages AS fromlang ON fromlang.id = t.lang_from WHERE e.id = ?';

            mysql.query(query2, [result.insertId], (error, email) => {
                if(error) throw error; 
                const mailOptions = {
                    from: '"DevTest" <vladik.semyonov.dev@gmail.com>',
                    to: 'vladik.semyonov@gmail.com',
                    subject: 'Translation Request',
                    html: `
                        <h4>Request</h4>
                        <h4>User</h4>
                        <ul>
                            <li>User: ${email[0].userName}</li>
                            <li>Email: ${email[0].userEmail}</li>
                            <li>Content: ${email[0].content}</li>
                        </ul>
                        <h4>Translator</h4>
                        <ul>
                            <li>Translator: ${email[0].transName}</li>
                            <li>Email: ${email[0].transEmail ? email[0].transEmail : 'Not Specified'}</li>
                            <li>Phone: ${email[0].transPhone ? email[0].transPhone : 'Not Specified'}</li>
                            <li>From: ${email[0].fromLang ? email[0].fromLang : 'Not Specified'}</li>
                            <li>To: ${email[0].toLang ? email[0].toLang : 'Not Specified'}</li>
                        </ul>
                    `
                }
                console.log(req.body);

                transporter.sendMail(mailOptions, (error, info) => {
                    if(error) throw error;
                    res.status(200).json(info);
                })
            });
        })
    })
});


// router.post('/:id', checkToken, (req, res) => {
//     // res.json(req.user.id);
//     let query = 'SELECT u.id AS userId, u.username AS userName, u.email AS userEmail, t.id AS transId, t.name AS transName, t.email AS transEmail, t.phone AS transPhone, lang_from.name AS fromLang, lang_to.name AS toLang FROM users AS u JOIN translators AS t ON t.id = ? LEFT JOIN languages AS lang_from ON t.lang_from = lang_from.id LEFT JOIN languages AS lang_to ON t.lang_to = lang_to.id WHERE u.id = ?';

//     mysql.query(query, [req.params.id, req.user.id], (error, result) => {
//         if(error) {
//             throw error
//         } else {
//             const mailOptions = {
//                 from: '"DevTest" <vladik.semyonov.dev@gmail.com>',
//                 to: 'vladik.semyonov@gmail.com',
//                 subject: 'Translation Request',
//                 html: 
//                 `
//                 <h4>Request</h4>
//                 <h4>User</h4>
//                 <ul>
//                     <li>User: ${result[0].userName}</li>
//                     <li>Email: ${result[0].userEmail}</li>
//                     <li>Content: ${req.body.content}</li>
//                 </ul>
//                 <h4>Translator</h4>
//                 <ul>
//                     <li>Translator: ${result[0].transName}</li>
//                     <li>Email: ${result[0].transEmail ? result[0].transEmail : 'Not Specified'}</li>
//                     <li>Phone: ${result[0].transPhone ? result[0].transPhone : 'Not Specified'}</li>
//                     <li>From: ${result[0].fromLang ? result[0].fromLang : 'Not Specified'}</li>
//                     <li>To: ${result[0].toLang ? result[0].toLang : 'Not Specified'}</li>
//                 </ul>`
//             }
//             transporter.sendMail(mailOptions, (error, info) => {
//                 if(error) throw error;
//                 let query = 'UPDATE `stats` SET `total_requests` = `total_requests` + 1 WHERE user_id = ?';
//                 let query2 = 'INSERT INTO emails (`email`, `user_id`, `trans_id`) VALUES (?, ?, ?)';

//                 mysql.query(query, [req.user.id], (error, value) => {
//                     if(error) throw error;
//                     mysql.query(query2, [result[0].userEmail, req.user.id, result[0].transId], (error, results) => {
//                         if(error) throw error;
//                         res.status(200).json(results);
//                     })
//                 })
//             })
//         };
        
//     })

// });


module.exports = router;









// module.exports = router;