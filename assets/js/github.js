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

function fetchGitHubInformation(event) {
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
        $.getJSON(`https://api.github.com/users/${username}`),
        $.getJSON(`https://api.github.com/users/${username}/repos`)
    ).then(
        function (firstResponse, secondResponse) {
            var userData = firstResponse[0];
            var repoData = secondResponse[0];
            $("#gh-user-data").html(userInformationHTML(userData));
            $("#gh-repo-data").html(repoInformationHTML(repoData));
        },
        function (errorResponse) {
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

$('#github-form').submit(function(event){
    event.preventDefault();
    fetchGitHubInformation(event);
})