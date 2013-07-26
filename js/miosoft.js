var MioWeb = MioWeb || {};

MioWeb.StringBuffer = function () {
	this.buffer = [];
};

MioWeb.StringBuffer.prototype = {
	append: function (s) {
		this.buffer[this.buffer.length] = s;
		return this;
	},

	toString: function() {
		return this.buffer.join("");
	}
};

MioWeb.checkPassword = function(candidatePassword, failureMessageHolder) {

	var status = true;
	var minPasswordLength = 12;
	var maxPasswordLength = 60;
	var failure = new MioWeb.StringBuffer();
	failure.append("Password invalid. Reasons are given below:\n\n");

	// Enforce minimum password length.
	if (candidatePassword.length < minPasswordLength)
	{
		failure.append("* Password must be at least " + minPasswordLength + " characters in length.\n");
		status = false;
	}

	// Enforce maximum password length.
	if (candidatePassword.length > maxPasswordLength)
	{
		failure.append("* Password must be at most " + maxPasswordLength + " characters in length.\n");
		status = false;
	}

	var predicatesAndClasses =
	[
		[ function (c) { return (c >= "0") && (c <= "9"); }, "digit" ],
		[ function (c)
	 	  {
			return (c >= "\u0020") && (c <= "\u007e") && !(
				((c >= "0") && (c <= "9")) || ((c >= "A") && (c <= "Z")) || ((c >= "a") && (c <= "z")));
		  }, "nonalphanumeric symbol" ],
		[ function (c) { return (c >= "A") && (c <= "Z"); }, "uppercase letter" ],
		[ function (c) { return (c >= "a") && (c <= "z"); }, "lowercase letter" ]
	];

	var anySatisfy = function (s, f)
	{
		for (var i = 0; i < s.length; i++)
		{
			if (f(s.charAt(i)))
			{
				return true;
			}
		}
		return false;
	};

	var allCharacterClasses = function ()
	{
		var classes = [];
		for (var i = 0; i < predicatesAndClasses.length; i++)
		{
			var assoc = predicatesAndClasses[i];
			classes[classes.length] = assoc[1];
		}
		return classes.join(", ");
	};

	// Verify that the password contains at least one digit, nonalphanumeric symbol, uppercase letter, and
	// lowercase letter.
	for (var i = 0; i < predicatesAndClasses.length; i++)
	{
		var assoc = predicatesAndClasses[i];
		if (!anySatisfy(candidatePassword, assoc[0]))
		{
			failure.append("* Password must contain at least one " + assoc[1] + ".\n");
			status = false;
		}
	}

	// Verify that the password does not sequence more than five elements within a given character class."
	var previousPredicate = null;
	var repeatCount = 0;
	for (var i = 0; i < candidatePassword.length; i++)
	{
		for (var j = 0; j < predicatesAndClasses.length; j++)
		{
			var assoc = predicatesAndClasses[j];
			if (assoc[0](candidatePassword.charAt(i)))
			{
				if (previousPredicate == assoc[0])
				{
					repeatCount++;
					if (repeatCount == 6)
					{
						failure.append("* Password must not sequentially repeat an element of a character class (" + allCharacterClasses() + ") more than five times.\n");
						status = false;
					}
				}
				else
				{
					previousPredicate = assoc[0];
					repeatCount = 1;
				}
			}
		}
	}

	if (!status)
	{
		failureMessageHolder.append(failure.toString());
	}

	return status;
};