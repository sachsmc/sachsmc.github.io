if(FALSE) {
refs <- readr::read_csv2("SachsItems.csv")
colnames(refs) <- make.names(colnames(refs))
refs <- refs[order(refs$Publication.Year, decreasing = TRUE),]
library(dplyr)

sortord <- sort(unique(with(expand.grid(letters, letters), paste0(Var1, Var2))))
constr_comment <- function(row){

    ii <- refs[row, ]

    key <- paste0(sortord[row], strsplit(ii$Author, ",")[[1]][1], ii$Publication.Year, strsplit(ii$Title, " ")[[1]][1])
    res <- c(sprintf("#' %s (%s) \\emph{%s}", ii$Title, ii$Publication.Year, ii$Publication.Title),
    "#' ",
    sprintf("#' %s", ii$Author),
    "#' ",
    sprintf("#' %s (%s). %s:%s. \\url{%s}", ii$Publication.Title, ii$Publication.Year,
            ii$Pages, ii$Volume, gsub("?otool=karolib&tool=karolinska", "", ii$Url, fixed = TRUE)),
    sprintf("#' @name %s",
            key),
    sprintf("#' @concept %s", ii$Tags),
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