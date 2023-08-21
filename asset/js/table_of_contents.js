function initPath(data, issue){
    $('.toc-path-box').html(`
    <span><a href="./">Home</a></span>
    <span>&gt;</span>
    <span><a href="">${data[issue].name}</a></span>
    `)
}

function initControl(data,issue) {
  let h=""
  if (issue!=0) {
    h+=`<div>
          <a href="./table_of_contents.html?issue=${data[issue-1].id}">
            <i class="fa-solid fa-angle-left"></i>                    
            PREVIOUS
          </a>
        </div>`
  }
  h+=`<div><a href="#all-issue">ALL ISSUE</a></div>`
  if (issue < data.length -1) {
    h+=`<div>
          <a href="./table_of_contents.html?issue=${data[issue+1].id}">
            NEXT
            <i class="fa-solid fa-angle-right"></i>   
          </a>                      
        </div>`
  }
  $(".control-box").html(h)
}

function initInfo(data,issue){
    $('.issue-info-box').html( $('.issue-info-box').html() + `
    <div class="book-cover-wrapper">
                <img src="${data[issue].imgCover}" alt="">
            </div>
            <div class="issue-detail">
                <div class="issue-title">SicenceJournal®</div>
                <div class="issue-release-date">${data[issue]["name"].toUpperCase()} • ${getStringUnixFullDay(data[issue].publicationDate).toUpperCase()}</div>
                <div class="issue-summary-box">
                    <p>${cutString(data[issue].news[0]["content"][0].text,150)}</p>
                    <div id="more">VIEW MORE</div>
                </div>
            </div>
    `)
    $("#more").click(()=>{
      if ($("#more").text()=="VIEW MORE") {
        $(".issue-summary-box>p").html(data[issue].news[0]["content"][0].text)
        $("#more").text("VIEW LESS")
      }else{
        $(".issue-summary-box>p").html(cutString(data[issue].news[0]["content"][0].text,150))
        $("#more").text("VIEW MORE")
      }
    })

}

function initNews(data,issue){
    let countNews = data[issue].news.length;
    let newsList=""
    for(let i=0;i<countNews;i++){
        let t = "N"+issue+"-"+i
        newsList+= `        
        <div class="article">
          <div class="mark" mark="${t}">
          <i class="fa-regular fa-bookmark"></i>    
          </div>
          <div class="a-title"><a href="./news.html?issue=${data[issue].id}&id=${i}">${data[issue].news[i].title}</a></div>
          <div class="a-info">
            <p class="author">${data[issue].news[i].author[0].name}</p>
            <p> | </p>
            <p class="release">${getStringUnixFullDay(data[issue].news[i].time).toUpperCase()}</p>
          </div>
          <div class="a-summary">
            <p>${cutString(data[issue].news[i]["content"][0].text,200)}</p>
          </div>
        </div>
    `    
    }
    $('.article-box').eq(0).html(newsList)
}

function initResearchs(data,issue){
    let countResearchs = data[issue].researchs.length;
    let researchsList=""
    for(let i=0;i<countResearchs;i++){
        let t = "R"+issue+"-"+i
        researchsList+= `        
        <div class="article">
          <div class="mark" mark="${t}">
            <i class="fa-regular fa-bookmark"></i>
          </div>
          <div class="a-title"><a href="./research.html?issue=${data[issue].id}&id=${i}">${data[issue].researchs[i].title}</a></div>
          <div class="a-info">
            <p class="author">${data[issue].researchs[i].authors[0].name}</p>
            <p> | </p>
            <p class="release">${getStringUnixFullDay(data[issue].news[i].time).toUpperCase()}</p>
          </div>
          <div class="a-summary">
            <p>${cutString(data[issue].researchs[i]["summary"],200)}</p>
          </div>
        </div>
    `    
    }
    $('.article-box').eq(1).html(researchsList)
}

function initAllIssue(data) {
  let h=""
  for (let i of data) {
    h+=`<div class="issue-wrapper">
          <a href="./table_of_contents.html?issue=${i.id}">
          <img class="" src="${i.imgCover}" alt="">
          </a>
        </div>`
  }
    $(".issue-container").html(h)
}

function initEventMark() {
    let arr = JSON.parse(localStorage.getItem("bookmark"))
    for (let i=0;i<$(".mark").length;i++) {
      let t = $(".mark").eq(i).attr("mark")
      if (arr.includes(t)) {
        $(".mark").eq(i).find("i").addClass("fa-solid")
        $(".mark").eq(i).find("i").removeClass("fa-regular")
      }
      $(".mark").eq(i).click(()=>{
        $(".mark").eq(i).find("i").toggleClass("fa-solid")
        $(".mark").eq(i).find("i").toggleClass("fa-regular")
        toggleMark(t)
    })
    }
    
}

async function init_toc(issueUrl){
    let check = false
    let issue = 0
    const data = await DATA()
    for (let i=0;i<data.length;i++) {
      if (data[i]["id"]===issueUrl) {
        issue=i
        check=true
        $("title").text(data[issue]["name"])
        // $(".cover-img").css({
        //   "background":`url('${data[issue]["imgCover"]}') no-repeat`
        // })
        initPath(data,issue)
        initControl(data,issue)
        initInfo(data,issue)
        initNews(data,issue)
        initResearchs(data,issue)
        initAllIssue(data)
        initEventMark()
      }
    } 
    if (!check) {
      $("body").html(err404HTML()) 
    }
}

$(document).ready(async function () {
  const issueUrl = new URLSearchParams(window.location.search).get('issue');   
  await init_toc(issueUrl);
});