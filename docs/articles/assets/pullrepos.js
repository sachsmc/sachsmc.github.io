(function ($, undefined) {

      // Put custom repo URL's in this object, keyed by repo name.
      var repoUrls = {
        "tufterhandout": "http://sachsmc.github.io/tufterhandout/",
        "knit-git-markr-guide": "http://sachsmc.github.io/knit-git-markr-guide/",
        "rreporttools": "http://sachsmc.github.io/rreporttools/"
      };

      function repoUrl(repo) {
        var uri = repo.homepage || repo.html_url;
		if(uri.substr(0, 4) != "http") {
			return "https://" + uri;
		} else {
			return uri;
		}
      }




      function addRepo(repo) {
        var $item = $("<li>").addClass("repo");
        var $link = $("<div>").appendTo($item);
        $link.append($("<a>").attr("href", repoUrl(repo)).addClass("reponame").text(repo.name));
        $link.append($("<h3>").text(repo.language));
        $link.append($("<p>").text(repo.description));
		$link.append($("<p>").text(repo.watchers + " stars").addClass("stargazers"));
		$link.append($("<p>").text(repo.forks + " forks").addClass("forks"));
		$link.append($("<p>").append($("<a>").attr("href", repo.html_url + "/fork")
			.html('<span class="mega-octicon octicon-repo-forked"></span> Fork').addClass("repolink")));
		$link.append($("<p>").append($("<a>").attr("href", repo.html_url)
			.html('<span class="mega-octicon octicon-repo"></span> Source').addClass("repolink")));
        $item.appendTo("#repos");
      }

      function addRepos(repos, page) {
        repos = repos || [];
        page = page || 1;
        var watch = 0;

        var uri = "https://api.github.com/users/sachsmc/repos?callback=?"
                + "&per_page=50"
                + "&page="+page;

        $.getJSON(uri, function (result) {
          if (result.data && result.data.length > 0) {
            repos = repos.concat(result.data);
            addRepos(repos, page + 1);
          }
          else {
            $(function () {
              $("#num-repos").text(repos.length);

                var wat = 0;
                for(var i=0; i<repos.length; i++){
                    wat = wat + repos[i].watchers;
                }

              $("#num-watch").text(wat);

              // Convert pushed_at to Date.
              $.each(repos, function (i, repo) {
                repo.pushed_at = new Date(repo.pushed_at);

                var weekHalfLife  = 1.146 * Math.pow(10, -9);

                var pushDelta    = (new Date) - Date.parse(repo.pushed_at);
                var createdDelta = (new Date) - Date.parse(repo.created_at);

                var weightForPush = 1;
                var weightForWatchers = 1.314 * Math.pow(10, 7);

                repo.hotness = weightForPush * Math.pow(Math.E, -1 * weekHalfLife * pushDelta);
                repo.hotness += weightForWatchers * repo.watchers / createdDelta;
              });

              // Sort by highest # of watchers.
              repos.sort(function (a, b) {
                if (a.hotness < b.hotness) return 1;
                if (b.hotness < a.hotness) return -1;
                return 0;
              });

              $.each(repos, function (i, repo) {
                addRepo(repo);
              });

              // Sort by most-recently pushed to.
              repos.sort(function (a, b) {
                if (a.pushed_at < b.pushed_at) return 1;
                if (b.pushed_at < a.pushed_at) return -1;
                return 0;
              });


            });
          }
        });
      }
      addRepos();


      function randomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
      }



    })(jQuery);