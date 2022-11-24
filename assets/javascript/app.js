$(document).ready(function () {
    var isClickingRecentSearch;
    $(".carousel").carousel();
    var recentSearches = [];
    var recentSongsFromLocalStorage = localStorage.getItem("song");

    if (recentSongsFromLocalStorage) {
        recentSearches = JSON.parse(recentSongsFromLocalStorage);
    } else {
        recentSearches = [];
    }

    


    function renderButton() {
        $("#recent").empty();
        jQuery.unique(recentSearches);
        for (var i = 0; i < recentSearches.length; i++) {
            var newButton = $("<button>");
            newButton.addClass("recentSong");
            newButton.addClass("pulse");
            newButton.attr("data-name", recentSearches[i])
            newButton.html(recentSearches[i])
            $("#recent").append(newButton);
        }
    }

    function searchMusic(songName) {
        if (isClickingRecentSearch === false) {
            recentSearches.push(songName);
            localStorage.setItem("song", JSON.stringify(recentSearches));
        }
        youtubeQuery(songName);
        lyricsQuery(songName);
    }

    $("#recent").on("click", ".recentSong", function (event, handler,) {
        isClickingRecentSearch = true
        document.addEventListener('touchstart', handler, {passive: true});
        var songName = event.target.getAttribute("data-name")
        console.log(event.target.getAttribute("data-name"));
        searchMusic(songName)
    })

    $("#submit-button").on("click", function () {
        isClickingRecentSearch = false;
        var songName = $("#song-search").val().trim();
        searchMusic(songName);
        renderButton();
        $("#song-search").val("")
    });



    function youtubeQuery(songName) {
        var youTubeURL =
            "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=vevo%20" + songName + "&VideoEmbedded=true&key=AIzaSyAQjTeJ334dyV3qKIRPn80zxhw1e4gM2Ww";

// AIzaSyBrUzOmwgzmZPFQ6rfWBY8-SyUp1C9LZ8Y
//AIzaSyDCr1e5nD_Tz9RErqA61M6TPv_lEKiTw4
//new api Key for YouTube AIzaSyAQjTeJ334dyV3qKIRPn80zxhw1e4gM2Ww
//changed the url to my own url because heroku wouldn't allow me to use their's.

        $.ajax({
            url: "https://protected-reaches-15262.herokuapp.com/" + youTubeURL
        }).then(function (response) {
            var videoID = response.items[0].id.videoId;
            $(".video-container").html(

                "<iframe id='ytplayer' type='text/html' width='300' height='300' src='https://www.youtube.com/embed/" + videoID + "?autoplay=1&origin=http:" + videoID + "?version=3' frameborder='0'></iframe>"

            );

        });
        
    }

    function lyricsQuery(songName) {
        var accessToken = "aB5kqaAZECyzU--9LkDp_QGCygvr42-91fCx7GBJGezunSnjw-bas1K5yeHlhK0H";
        var geniusURL = "https://api.genius.com/search?q=" + songName + "&access_token=" + accessToken;

        $.ajax({
            url: geniusURL,
            method: "GET"
        }).then(function (response) {
            $("#lyrics-content").empty();
            var lyricsURL = response.response.hits[0].result.url;
            var artist = response.response.hits[0].result.primary_artist.name;
            tasteQuery(artist);
            $.ajax({
                url: "https://protected-reaches-15262.herokuapp.com/" + lyricsURL,
                method: "GET"
            }).then(function (response) {
                var songLyricsLinesList = $(response)
                    .find(".lyrics")
                    .find("p")
                    .text()
                    .split("\n");

                for (i = 0; i < songLyricsLinesList.length; i++) {
                    var songLineDiv = $("<div>").addClass("songline");
                    $(songLineDiv).text(songLyricsLinesList[i]);
                    $(songLineDiv).appendTo("#lyrics-content");
                }
            });
        });
        function tasteQuery(artist) {
            var tasteDiveURL =
                "https://protected-reaches-15262.herokuapp.com/" + "https://tastedive.com/api/similar?q=" + artist + "&type=band&limit=5&k=341252-project1-GORKXH3A";

            $.ajax({
                url: tasteDiveURL,
                method: "GET"
            }).then(function (response) {
                var suggestionsArray = [];
                response.Similar.Results.map(function (artist) {
                    suggestionsArray.push(artist.Name);
                    $("#first-carousel").text(suggestionsArray[0]);
                    $("#second-carousel").text(suggestionsArray[1]);
                    $("#third-carousel").text(suggestionsArray[2]);
                    $("#fourth-carousel").text(suggestionsArray[3]);
                    $("#fifth-carousel").text(suggestionsArray[4]);
                });
            });
        }

    }
    renderButton();
});

