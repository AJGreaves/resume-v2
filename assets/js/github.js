/**
 * Function takes one parameter {user} which is the
 * users data from the GitHub API. The data within this is used to build
 * the user profile HTML returned from the function.
 */
function userInformationHTML(user) {
    return `
        <h4>${user.name}
            <span class="small-name">
                (@<a href="${user.html_url}" target="_blank" rel="noopener">${user.login}</a>)
            </span>
        </h4>
        <div class="gh-content">
            <div class="gh-avatar">
                <a href="${user.html_url}" target="_blank" rel="noopener">
                    <img src="${user.avatar_url}" width="80" height="80" alt="${user.login}" />
                </a>
            </div>
            <p>
                Followers: ${user.followers}
                <br>
                Following: ${user.following}
                <br>
                Repos: ${user.public_repos}
            </p>
        </div>`;
}

/**
 * Function takes one parameter {repos} which is the
 * repository data retrieved from the GitHub API. This data is then 
 * used to build an HTML list of each repo and return the completed
 * HTML from the function.
 */
function repoInformationHTML(repos) {
    if (repos.length == 0) {
        return `<div class="clearfix repo-list">No repos!</div>`;
    }

    var listItemsHTML = repos.map(function (repo) {
        return `<li>
                    <a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a>
                </li>`;
    });

    return `<div class="clearfix repo-list">
                <ul>
                    ${listItemsHTML.join("\n")}
                </ul>
            </div>`;
}

/**
 * Function is triggered when the search button on the github page is
 * clicked. It retrieves the username provided and assigns it to the username
 * variable, handles if no username has been provided. If a username has been provided,
 * the function inserts the loading gif while it fetches the data and uses the userInformationHTML
 * and repoInformationHTML functions to build the relevant HTML and insert it into the DOM.   
 */
function fetchGitHubInformation() {
    $("#gh-user-data").html("");
    $("#gh-repo-data").html("");

    var username = $("#gh-username").val();
    if (!username) {
        $("#gh-user-data").html(`<h2>Please enter a GitHub username</h2>`);
        return;
    }

    $("#gh-user-data").html(
        `<div id="loader">
            <img src="assets/css/loader.gif" alt="loading..." />
        </div>`);

    $.when(
        // fetch profile and repos data
        $.getJSON(`https://api.github.com/users/${username}`),
        $.getJSON(`https://api.github.com/users/${username}/repos`)
    ).then(
        function (firstResponse, secondResponse) {
            var userData = firstResponse[0];
            var repoData = secondResponse[0];
            // Call userInformationHTML and repoInformationHTML functions
            // and insert the created html into the DOM
            $("#gh-user-data").html(userInformationHTML(userData));
            $("#gh-repo-data").html(repoInformationHTML(repoData));
        },
        function (errorResponse) {
            // Handles errors due to unknown username, too many requests and other errors.
            // To give feedback to users.
            if (errorResponse.status === 404) {
                $("#gh-user-data").html(
                    `<p>No info found for user ${username}</p>`);
            } else if (errorResponse.status === 403) {
                var resetTime = new Date(errorResponse.getResponseHeader('X-RateLimit-Reset') * 1000);
                $("#gh-user-data").html(`<p>Too many requests, please wait until ${resetTime.toLocaleTimeString()}</p>`);
            } else {
                console.log(errorResponse);
                $("#gh-user-data").html(
                    `<p>Error: ${errorResponse.responseJSON.message}</p>`);
            }
        });
}

$(document).ready(fetchGitHubInformation);

/**
 * Adds a submit event to the #github-form,
 * prevents the submit button from refreshing the page
 * and calls the fetchGitHubInformation() function.
 */
$('#github-form').submit(function(event){
    event.preventDefault();
    fetchGitHubInformation();
});