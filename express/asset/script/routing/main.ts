import "bootstrap";
import $ from "jquery";

import ns from "../common/ns";

ns("routing.index", function () {
  $("a.logout").on("click", e => {
    $(e.currentTarget).closest("form").submit();
  });

  const $question = $("input[name=question]");
  const $answer = $("div.answer");

  $("#question-button").on("click", () => {
    $(".loading").show("fast");
    $(".btn-question").prop("disabled", true).addClass("disabled");
    $(".help-block").text("");

    setTimeout(() => {
      const ajax = $.get("/routing/question", { "question": $question.val() });
      ajax
        .done(data => $answer.show("fast").find("p.content").text(data.answer))
        .fail(resp => {
          if (resp.status === 400) {
            const err = resp.responseJSON[0];
            const $field = $(".help-block").filter(`.${err.param}`);
            if ($field.length > 0) {
              $field.text(err.msg);
            }
          }
        })
        .always(() => {
          $(".loading").hide();
          $(".btn-question").prop("disabled", false).removeClass("disabled");
        });
    }, 2000);
  });
});
