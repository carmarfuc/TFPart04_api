const { Router } = require("express");
const router = Router();
const { Review } = require("../db.js");

router.get("/:productId", (req, res) => {
    Review.findAll({
        where: {
            productId: req.params.productId
        }
    }).then(review => {
        const reviewProd = review.map(review => {
            return {
                userEmail: review.userEmail,
                description: review.description,
                ranking: review.ranking,
                createdAt: review.createdAt,


            }
        })
        res.json(reviewProd);
    }
    ).catch(err => {
        res.send(err);
    }
    );
}
);

router.get("/user/:userEmail", (req, res) => {
    Review.findAll({
        where: {
            userEmail: req.params.userEmail
        }
    }).then(review => {
        const reviewUser = review.map(review => {
            return {
                id: review.id,
                productId: review.productId,
            }
        })

        res.json(reviewUser);
    }
    ).catch(err => {
        res.send(err);
    });
});



module.exports = router;