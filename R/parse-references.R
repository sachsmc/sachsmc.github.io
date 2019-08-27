if(FALSE) {
refs <- readr::read_csv("SachsItems.csv")
colnames(refs) <- make.names(colnames(refs))
refs <- refs[order(refs$Publication.Year, decreasing = TRUE),]
library(dplyr)

refs <- refs %>% group_by(Manual.Tags) %>% mutate(fNum = 1:n())


constr_comment <- function(row){

    ii <- refs[row, ]
    res <- c(sprintf("#' %s (%s) \\emph{%s}", ii$Title, ii$Publication.Year, ii$Publication.Title),
    "#' ",
    sprintf("#' %s", ii$Author),
    "#' ",
    sprintf("#' %s (%s). %s:%s. \\url{%s}", ii$Publication.Title, ii$Publication.Year,
            ii$Pages, ii$Volume, ii$Url),
    sprintf("#' @name %s", paste0(gsub(" ", "-", ii$Manual.Tags), "-", ii$fNum, '\n')),
    "NULL \n")

    res


}

twri <- NULL
for(i in 1:nrow(refs)) {

    twri <- c(twri, constr_comment(i))
}

options(encoding = "UTF-8")
cat(twri, file = "R/Publications.R", sep = "\n")
}