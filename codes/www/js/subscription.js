function init_subscription() {
    alert("DFDF")
    let session_id = localStorage.getItem('session_id')

    console.log("Sanity check!");
    var subscription_data = null;
    var stripe = null;
    if (session_id) {
        settings = get_settings_checkout("config/", "GET");
        $.ajax(settings).done(function(response) {
            data = JSON.parse(response);
            stripe = Stripe(data.publicKey);

            settings = get_settings_checkout("retrieve-subscription/", "GET")
            $.ajax(settings).done(function(response) {
                subscription_data = JSON.parse(response);
                console.log("HEre is my subscription status:" + subscription_data)
            }).then((res) => {
                return res
            });

        });
    }
    $(".agentstat-login").click(function() {
        // if person is not active in their accout ask them to signup
        if (!(session_id)) {
            return window.location.href = '/signup/'
        }

        // if they they have subscription var populated
        if (subscription_data && subscription_data.subscription === 'true') {
            return window.location.href = '/Ai/'
        }
        else if (subscription_data) {
            settings = get_settings_checkout("create-checkout-session/", "GET")
            $.ajax(settings).done(function(response) {
                console.log("Data", data)
                data_session = JSON.parse(response);

                // Redirect to Stripe Chaeckout
                stripe = Stripe(data.publicKey);
                console.log("stripe", stripe)
                return stripe.redirectToCheckout({
                    sessionId: data_session.sessionId
                })
            }).then((res) => {
                console.log(res);
            });
        }
    })
}
